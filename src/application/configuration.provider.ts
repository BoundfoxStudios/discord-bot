import { LinksCommandConfiguration } from '../bot/commands/links-command.ts';
import { config, join, parse, readJsonSync } from '../deps.ts';
import { deriveDebug } from '../utils.ts';

const debug = deriveDebug('ConfigurationProvider');

export interface Configuration {
  server: ServerConfiguration;
  discord: DiscordConfiguration;
  database: DatabaseConfiguration;
  commands: CommandsConfiguration;
}

export interface CommandsConfiguration {
  links: LinksCommandConfiguration;
}

export interface DiscordConfiguration {
  token: string;
  prefix: string;
  reactions: ReactionConfiguration[];
}

export interface ReactionConfiguration {
  channelId: string;
  messageId: string;
  roleName: string;
  emoji: string;
}

export interface ServerConfiguration {
  port: number;
}

export interface DatabaseConfiguration {
  filepath: string;
}

export class ConfigurationProvider {
  private internalConfiguration!: Configuration;
  private configurationFile!: Configuration;

  get current(): Readonly<Configuration> {
    return Object.freeze(this.internalConfiguration);
  }

  initialize(): void {
    debug('Initializing...');

    config({ export: true });

    this.loadJsonConfigurationFile();

    this.internalConfiguration = {
      server: this.validateServerConfiguration(),
      discord: this.validateDiscordConfiguration(),
      database: this.validateDatabaseConfiguration(),
      commands: this.validateCommandsConfiguration(),
    };

    // Just to remove the token, so we don't log it.
    const configurationClone = JSON.parse(JSON.stringify(this.internalConfiguration)) as Configuration;
    delete configurationClone.discord.token;

    debug('Parsed configuration file %o', configurationClone);
  }

  private loadJsonConfigurationFile(): void {
    const args = parse(Deno.args);
    const file = Deno.env.get('BOT_CONFIG_FILE') || args['bot-config-file'] || join(Deno.cwd(), 'configuration.json');

    debug(`Trying to read from configuration file ${file}`);

    if (!Deno.statSync(file).isFile) {
      debug('Configuration file was not found.');
      return;
    }

    this.configurationFile = readJsonSync(file) as Configuration;
  }

  private validateServerConfiguration(): ServerConfiguration {
    // @ts-ignore
    const port = +Deno.env.get('PORT') || 8080;

    return { port };
  }

  private validateDiscordConfiguration(): DiscordConfiguration {
    const token = Deno.env.get('DISCORD_TOKEN') || this.configurationFile.discord.token;
    const prefix = this.configurationFile.discord.prefix || '!';

    if (!token) {
      throw new Error('DISCORD_TOKEN not set.');
    }

    return { token, prefix, reactions: this.configurationFile.discord.reactions };
  }

  private validateDatabaseConfiguration(): DatabaseConfiguration {
    const filepath = this.configurationFile.database.filepath;

    if (!filepath) {
      throw new Error('database.filepath not set.');
    }

    return { filepath };
  }

  // TODO: Better validation for commands.
  private validateCommandsConfiguration(): CommandsConfiguration {
    const commands = this.configurationFile.commands;

    if (!commands) {
      throw new Error('commands not set.');
    }

    return commands;
  }
}
