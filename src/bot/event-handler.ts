import { Configuration } from '../application/configuration.provider.ts';
import { DiTokens } from '../application/di-tokens.ts';
import { EventHandlers, Inject, Injectable, Message, MessageReactionPayload, Reaction_Payload } from '../deps.ts';
import { deriveDebug } from '../utils.ts';
import { CommandHandler } from './command-handler.ts';
import { ReactionHandler } from './reaction-handler.ts';

const debug = deriveDebug('EventHandler');

@Injectable()
export class EventHandler implements EventHandlers {
  constructor(
    @Inject(DiTokens.Configuration) private readonly configuration: Configuration,
    @Inject(CommandHandler) private readonly commandHandler: CommandHandler,
    @Inject(ReactionHandler) private readonly reactionHandler: ReactionHandler,
  ) {
  }

  ready(): void {
    debug('Ready event received.');
  }

  messageCreate(message: Message): void {
    if (!message.content.startsWith(this.configuration.discord.prefix)) {
      return;
    }

    debug('Received a potential message...');

    this.commandHandler.process(message);
  }

  reactionAdd(message: Message | MessageReactionPayload, emoji: Reaction_Payload, userId: string): void {
    this.reactionHandler.add(message, emoji, userId);
  }

  reactionRemove(message: Message | MessageReactionPayload, emoji: Reaction_Payload, userId: string): void {
    this.reactionHandler.remove(message, emoji, userId);
  }
}
