import { Configuration } from '../application/configuration.provider.ts';
import { DiTokens } from '../application/di-tokens.ts';
import { Database, Inject, Injectable } from '../deps.ts';
import { deriveDebug } from '../utils.ts';
import { CategoryModel, LinkModel } from './models/links-command-models.ts';

const debug = deriveDebug('DatabaseProvider');

@Injectable()
export class DatabaseProvider {
  constructor(
    @Inject(DiTokens.Configuration) private readonly configuration: Configuration,
  ) {
  }

  async connect(): Promise<void> {
    const { filepath } = this.configuration.database;

    debug('Connecting to sqlite3 database at %s', filepath);

    const db = new Database('sqlite3', { filepath });

    db.link([CategoryModel, LinkModel]);

    await db.sync();
  }
}
