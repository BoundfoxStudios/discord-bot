import { Configuration } from '../application/configuration.provider.ts';
import { DiTokens } from '../application/di-tokens.ts';
import {
  ActivityType,
  editBotsStatus,
  EventHandlers,
  Guild,
  Inject,
  Injectable,
  Message,
  MessageReactionPayload,
  Reaction_Payload,
  StatusType,
} from '../deps.ts';
import { deriveDebug } from '../utils.ts';
import { VERSION } from '../version.ts';
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

    editBotsStatus(StatusType.Online, `**!info** | v${VERSION}`, ActivityType.Game);
  }

  guildCreate(guild: Guild): void {
    // If the guild was "created" which basically means that the bot got information about the server it has joined,
    // we can start the reaction sync. Before this event, the cache.channels will not be populated.
    void this.reactionHandler.syncReactions(guild);
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
