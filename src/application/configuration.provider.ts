import { config } from '../deps.ts';
import { deriveDebug } from '../utils.ts';

const debug = deriveDebug('ConfigurationProvider');

export interface Configuration {
  server: ServerConfiguration;
}

export interface ServerConfiguration {
  port: number;
}

export class ConfigurationProvider {
  private internalConfiguration!: Configuration;

  get current(): Readonly<Configuration> {
    return Object.freeze(this.internalConfiguration);
  }

  initialize(): void {
    debug('Initializing...');

    config({ export: true });

    this.internalConfiguration = {
      server: this.validateServerConfiguration(),
    };
  }

  private validateServerConfiguration(): ServerConfiguration {
    // @ts-ignore
    const port = +Deno.env.get('PORT') || 8080;

    return { port };
  }
}
