import { Configuration } from '../application/configuration.provider.ts';
import { DiTokens } from '../application/di-tokens.ts';
import { EventHandlers, Inject, Injectable, Message } from '../deps.ts';
import { deriveDebug } from '../utils.ts';
import { Commander } from './commander.ts';

const debug = deriveDebug('EventHandler');

@Injectable()
export class EventHandler implements EventHandlers {
  constructor(
    @Inject(DiTokens.Configuration) private readonly configuration: Configuration,
    @Inject(Commander) private readonly commander: Commander,
  ) {
  }

  ready() {
    debug('Ready event received.');
  }

  messageCreate(message: Message) {
    if (!message.content.startsWith(this.configuration.discord.prefix)) {
      return;
    }

    debug('Received a potential message...');

    this.commander.process(message);
  }
}
