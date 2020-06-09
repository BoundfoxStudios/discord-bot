import * as nodeDebug from 'debug';
import { Client } from 'discord.js';
import { inject, injectable } from 'inversify';
import { CommandBase } from '../commands/command';
import { DiTokens } from '../di-tokens';
import { Configuration } from './configuration.service';

const debug = nodeDebug('bot:DiscordService');

@injectable()
export class DiscordService {
  private client: Client;

  constructor(
    @inject(DiTokens.Configuration) private readonly configuration: Configuration,
    @inject(DiTokens.CommandProvider) private readonly commandProvider: () => CommandBase[],
  ) {}

  get discordClient(): Client {
    return this.client;
  }

  initialize(): Promise<void> {
    debug('Initializing...');

    this.client = new Client({
      presence: {
        status: 'online',
        activity: {
          type: 'CUSTOM_STATUS',
          name: 'Being helpful',
          url: 'https://boundfoxstudios.com',
        },
      },
    });

    debug('Logging in...');

    return this.client.login(this.configuration.discord.token).then(
      () => {
        debug('Login successful!');
        return this.initializeCommands();
      },
      err => debug('Error logging in %s', err),
    );
  }

  private initializeCommands(): Promise<void> {
    const commands = this.commandProvider();

    debug('Setting up %d commands...', commands.length);

    return Promise.all(
      commands.map(command => {
        const commandName = (command as any).constructor.name;

        debug('Initializing command %s', commandName);

        return command
          .initialize(this.configuration.commands[commandName])
          .catch(err => debug('Error initializing command %s: %s', commandName, err));
      }),
    ).then();
  }
}
