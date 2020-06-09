import { retryBackoff } from 'backoff-rxjs';
import * as nodeDebug from 'debug';
import { createWriteStream } from 'fs';
import { inject, injectable } from 'inversify';
import { DateTime } from 'luxon';
import { from, Observable, of, Subject, throwError } from 'rxjs';
import { concatMap, finalize, map, mapTo, switchMap } from 'rxjs/operators';
import * as tempy from 'tempy';
import { DiTokens } from '../di-tokens';
import { Configuration } from './configuration.service';
import del = require('del');
import needle = require('needle');

const debug = nodeDebug('bot:PiwigoService');

type UploadResult =
  | {
      stat: 'ok';
      result: {
        url: string;
      };
    }
  | {
      stat: 'fail';
      message: string;
    };

interface UploadQueueItem {
  categoryId: number;
  author: string;
  comment: string;
  imageUrl: string;
  resultSubject: Subject<string>;
}

@injectable()
export class PiwigoService {
  private itemsInQueue = 0;
  private loginCookie: string;
  private validLoginCookieLengthInSeconds = 1000 * 60 * 5; // five minutes
  private lastLoginCookieTime: number;
  private readonly uploadQueueSubject = new Subject<UploadQueueItem>();

  constructor(@inject(DiTokens.Configuration) private readonly configuration: Configuration) {}

  get queuedItemsCount(): number {
    return this.itemsInQueue;
  }

  private get allowedFileExtensions(): string[] {
    return ['jpg', 'jpeg', 'png', 'gif'];
  }

  initialize(): void {
    this.uploadQueueSubject
      .pipe(
        switchMap(item => this.getLoginCookie$().pipe(map(cookie => ({ item, cookie })))),
        concatMap(({ item, cookie }) =>
          of(null).pipe(
            switchMap(() =>
              from(this.performUpload(item, cookie)).pipe(
                map(url => ({ url, item })),
                retryBackoff({ initialInterval: 1000, maxRetries: 10 }),
              ),
            ),
          ),
        ),
      )
      .subscribe(({ item, url }) => {
        debug('%s has been uploaded!', url);

        this.itemsInQueue--;
        item.resultSubject.next(url);
        item.resultSubject.complete();
      });
  }

  isFileUrlAllowed(fileUrl: string): boolean {
    const fileExtension = this.getUrlFileExtension(fileUrl);
    return this.allowedFileExtensions.some(allowedFileExtension => allowedFileExtension === fileExtension);
  }

  upload$(categoryId: number, author: string, comment: string, imageUrl: string): Observable<string> {
    const resultSubject = new Subject<string>();

    debug('Queuing %s for upload', imageUrl);

    this.itemsInQueue++;

    this.uploadQueueSubject.next({
      author,
      categoryId,
      comment,
      imageUrl,
      resultSubject,
    });

    return resultSubject;
  }

  private performUpload({ categoryId, imageUrl, author, comment }: UploadQueueItem, cookie: string): Observable<string> {
    debug('Uploading %s', imageUrl);

    const fileName = DateTime.local().toFormat('yyyy-MM-dd-HH-mm-ss-SSS');

    return of(tempy.file({ name: `${fileName}.${this.getUrlFileExtension(imageUrl)}` })).pipe(
      switchMap(path => from(this.downloadImage(imageUrl, path)).pipe(mapTo(path))),
      switchMap(path =>
        from(
          needle(
            'post',
            this.getMethodApiUrl('pwg.images.addSimple'),
            {
              // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
              image: { file: path, content_type: this.getContentType(this.getUrlFileExtension(imageUrl)) },
              author,
              comment,
              category: categoryId,
            },
            {
              multipart: true,
              cookies: {
                // eslint-disable-next-line camelcase,@typescript-eslint/camelcase
                pwg_id: cookie,
              },
            },
          ),
        ).pipe(
          finalize(() => del.sync(path, { force: true })),
          switchMap(response => {
            const parsedResponse = JSON.parse(response.body) as UploadResult;

            if (parsedResponse.stat === 'fail') {
              return throwError(parsedResponse.message);
            }

            return of(parsedResponse.result.url);
          }),
        ),
      ),
    );
  }

  private downloadImage(imageUrl: string, path: string): Promise<void> {
    debug('Downloading image %s to %s', imageUrl, path);

    const writeStream = createWriteStream(path);

    return new Promise<void>((resolve, reject) => {
      needle
        .get(imageUrl)
        .pipe(writeStream)
        .on('finish', () => resolve())
        .on('error', error => reject(error));
    }).finally(() => writeStream.close());
  }

  private getContentType(fileExtension: string): string {
    fileExtension = fileExtension.toLowerCase();

    switch (fileExtension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      default:
        return 'image/png';
    }
  }

  private getUrlFileExtension(fileUrl: string): string {
    const splitFileUrl = fileUrl.split('.');
    return splitFileUrl[splitFileUrl.length - 1];
  }

  private getMethodApiUrl(method: string): string {
    return `${this.configuration.piwigo.apiUrl}?method=${method}&format=json`;
  }

  private getLoginCookie$(): Observable<string> {
    if (this.lastLoginCookieTime + this.validLoginCookieLengthInSeconds > Date.now()) {
      debug('Returning cached login cookie');
      return of(this.loginCookie);
    }

    return from(
      needle(
        'post',
        this.getMethodApiUrl('pwg.session.login'),
        {
          username: this.configuration.piwigo.username,
          password: this.configuration.piwigo.password,
        },
        { multipart: true },
      ),
    ).pipe(
      map(response => {
        if (response.statusCode !== 200) {
          debug('Error! %s.', response.statusMessage);
          return throwError('Login not possible!');
        }

        // eslint-disable-next-line camelcase
        if (!response.cookies?.pwg_id) {
          debug('Login cookie not set.');
          return throwError('Login Cookie not set.');
        }

        this.lastLoginCookieTime = Date.now();
        return (this.loginCookie = response.cookies.pwg_id);
      }),
    );
  }
}
