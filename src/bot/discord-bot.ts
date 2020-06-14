import { Configuration } from '../application/configuration.provider.ts';
import { DiTokens } from '../application/di-tokens.ts';
import { createClient, Inject, Injectable, Intents } from '../deps.ts';
import { deriveDebug } from '../utils.ts';
import { EventHandler } from './event-handler.ts';

const debug = deriveDebug('DiscordBot');

@Injectable()
export class DiscordBot {
  private hasStarted = false;

  constructor(
    @Inject(DiTokens.Configuration) private readonly configuration: Configuration,
    @Inject(EventHandler) private readonly eventHandler: EventHandler,
  ) {
  }

  async start(): Promise<void> {
    if (this.hasStarted) {
      debug('The bot is already running.');
      return Promise.resolve();
    }

    this.hasStarted = true;

    debug('Initializing...');

    await createClient({
      token: this.configuration.discord.token,
      intents: [Intents.GUILD_MESSAGES, Intents.GUILDS, Intents.GUILD_MESSAGE_REACTIONS],
      eventHandlers: this.eventHandler
    });
  }
}
