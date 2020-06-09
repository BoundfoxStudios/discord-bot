import * as nodeDebug from 'debug';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { injectable } from 'inversify';
import { join } from 'path';
import { ImageUploadCommandConfiguration } from '../commands/image-upload.command';

const debug = nodeDebug('bot:ConfigurationService');

export type Configuration = ProcessConfiguration & { commands: CommandsConfiguration };

export interface ProcessConfiguration {
  discord: {
    token: string;
  };
  piwigo: {
    apiUrl: string;
    username: string;
    password: string;
  };
}

export interface CommandsConfiguration {
  ImageUploadCommand: ImageUploadCommandConfiguration;
}

@injectable()
export class ConfigurationService {
  private internalConfiguration: Configuration;

  get current(): Configuration {
    return this.internalConfiguration;
  }

  initialize(): void {
    debug('Initializing...');
    this.loadDotEnv();

    const processConfiguration = this.validateProcessConfiguration();
    const commandsConfiguration = this.loadCommandsConfiguration();

    this.internalConfiguration = { ...processConfiguration, commands: commandsConfiguration };
  }

  private loadDotEnv(): void {
    debug('Loading dotenv...');
    config();
  }

  private validateProcessConfiguration(): ProcessConfiguration {
    const discordToken = process.env.DISCORD_TOKEN;
    const piwigoUsername = process.env.PIWIGO_USERNAME;
    const piwigoPassword = process.env.PIWIGO_PASSWORD;
    const piwigoApiUrl = process.env.PIWIGO_API_URL;

    if (!discordToken) {
      debug('Environment variable DISCORD_TOKEN not set.');
      throw new Error('Discord Token not set');
    }

    if (!piwigoUsername) {
      debug('Environment variable PIWIGO_USERNAME not set.');
      throw new Error('Piwigo Username not set');
    }

    if (!piwigoPassword) {
      debug('Environment variable PIWIGO_PASSWORD not set.');
      throw new Error('Piwigo Username not set');
    }

    if (!piwigoApiUrl) {
      debug('Environment variable PIWIGO_API_URL not set.');
      throw new Error('Piwigo Username not set');
    }

    return {
      discord: {
        token: discordToken,
      },
      piwigo: {
        apiUrl: piwigoApiUrl,
        username: piwigoUsername,
        password: piwigoPassword,
      },
    };
  }

  private loadCommandsConfiguration(): CommandsConfiguration {
    return JSON.parse(readFileSync(join(__dirname, '..', 'commands.config.json'), { encoding: 'utf-8' }));
  }
}
