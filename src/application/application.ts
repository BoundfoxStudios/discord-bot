import { ApiArea } from '../api/area.ts';
import { App } from '../deps.ts';
import { deriveDebug } from '../utils.ts';

const debug = deriveDebug('Application');

export class Application {
  private app?: App<any>;

  async initialize(): Promise<void> {
    this.app = new App({ areas: [ApiArea], logging: true });
  }

  async listen(): Promise<void> {
    if (!this.app) {
      debug('Can not start server, did you run initialize?');
      return;
    }

    await this.app.listen();
  }
}
