import { Configuration, ReactionConfiguration } from '../application/configuration.provider.ts';
import { DiTokens } from '../application/di-tokens.ts';
import {
  addRole,
  cache,
  Guild,
  Inject,
  Injectable,
  Message,
  MessageReactionPayload,
  Reaction_Payload,
  removeRole,
  Role,
} from '../deps.ts';
import { deriveDebug } from '../utils.ts';
import { getRoleByName } from './bot-helper-utils.ts';

const debug = deriveDebug('RulesCommand');

@Injectable()
export class ReactionHandler {
  private readonly configuration: ReactionConfiguration[];

  constructor(@Inject(DiTokens.Configuration) configuration: Configuration) {
    this.configuration = configuration.discord.reactions;
  }

  add(message: Message | MessageReactionPayload, emoji: Reaction_Payload, userId: string): void {
    this.process(message, (role, guild) => {
      debug('Adding role %s to user %s.', role.name, userId);
      addRole(guild, userId, role.id, `Self-assign role by user ${userId}.`);
    });
  }

  remove(message: Message | MessageReactionPayload, emoji: Reaction_Payload, userId: string): void {
    this.process(message, (role, guild) => {
      debug('Removing role %s to user %s.', role.name, userId);
      removeRole(guild.id, userId, role.id, `Self-remove role by user ${userId}.`);
    });
  }

  private process(message: Message | MessageReactionPayload, successCallback: (role: Role, guild: Guild) => void) {
    let configuration: ReactionConfiguration | undefined;

    if (!messageIsMessageReactionPayload(message)
      || !cache.guilds.has(message.guild_id)
      || !(configuration = this.getConfigurationForMessage(message.message_id, message.emoji.name!))
    ) {
      return;
    }

    const guild = cache.guilds.get(message.guild_id)!;
    const role = getRoleByName(guild, configuration.roleName);

    if (!role) {
      debug(`Role ${configuration.roleName} not found.`);
      return;
    }

    successCallback(role, guild);
  }

  private getConfigurationForMessage(messageId: string, emoji: string): ReactionConfiguration | undefined {
    return this.configuration.find(configuration => configuration.messageId === messageId && configuration.emoji === emoji);
  }
}

function messageIsMessageReactionPayload(input: Message | MessageReactionPayload): input is Required<MessageReactionPayload> {
  const inputAsPayload = input as MessageReactionPayload;
  return !!inputAsPayload.user_id && !!inputAsPayload.guild_id && !!inputAsPayload.message_id && !!inputAsPayload.emoji && !!inputAsPayload.emoji.name;
}
