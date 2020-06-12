import { ApiArea } from '../api/area.ts';
import { App, container, instanceCachingFactory } from '../deps.ts';
import { deriveDebug } from '../utils.ts';
import { AlosaurDebugAdapter } from './alosaur-debug-adapter.ts';
import { Configuration, ConfigurationProvider } from './configuration.provider.ts';
import { DiTokens } from './di-tokens.ts';

const debug = deriveDebug('Application');

export class Application {
  private app?: App<any>;

  async initialize(): Promise<void> {
    this.initializeDependencyInjection();

    await AlosaurDebugAdapter.apply();

    this.app = new App({ areas: [ApiArea], logging: true });
  }

  async listen(): Promise<void> {
    if (!this.app) {
      debug('Can not start server, did you run initialize?');
      return;
    }

    const configuration = container.resolve<Configuration>(DiTokens.Configuration);

    await this.app.listen(`:${configuration.server.port}`);
  }

  private initializeDependencyInjection() {
    container.registerSingleton(ConfigurationProvider);
    container.register(DiTokens.Configuration, {
      useFactory: instanceCachingFactory(resolver => {
        const configurationProvider = resolver.resolve(ConfigurationProvider);
        configurationProvider.initialize();
        return configurationProvider.current;
      }),
    });
  }
}
