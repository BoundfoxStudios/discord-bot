import { alosaurLog } from '../deps.ts';
import { deriveDebug } from '../utils.ts';

const debug = deriveDebug('Alosaur');

class AlosaurDebug extends alosaurLog.handlers.BaseHandler {
  log(message: string): void {
    debug(message);
  }
}

export class AlosaurDebugAdapter {
  static async apply(): Promise<void> {
    await alosaurLog.setup({
      handlers: {
        console: new AlosaurDebug('DEBUG'),
      },
      loggers: {
        default: {
          level: 'DEBUG',
          handlers: ['console'],
        },
      },
    });
  }
}
