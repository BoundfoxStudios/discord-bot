import { Configuration, ReactionConfiguration } from '../application/configuration.provider.ts';
import { DiTokens } from '../application/di-tokens.ts';
import {
  addRole,
  cache, Channel, getChannels,
  getMember,
  getMessage,
  getReactions,
  Guild,
  Inject,
  Injectable,
  Member,
  Message,
  MessageReactionPayload,
  Reaction_Payload,
  removeRole,
  Role,
  UserPayload,
} from '../deps.ts';
import { deriveDebug } from '../utils.ts';
import { getRoleByName } from './bot-helper-utils.ts';

const debug = deriveDebug('RulesCommand');

@Injectable()
export class ReactionHandler {
  private readonly configuration: ReactionConfiguration[];
  private syncDone = false;

  constructor(@Inject(DiTokens.Configuration) configuration: Configuration) {
    this.configuration = configuration.discord.reactions;
  }

  add(message: Message | MessageReactionPayload, emoji: Reaction_Payload, userId: string): void {
    this.process(message, (role, guild, member) => {
      debug('Adding role %s to user %s (%s).', role.name, member.user?.username, member.user?.id || userId);
      addRole(guild, userId, role.id, `Self-assign role by user ${userId}.`);
    });
  }

  remove(message: Message | MessageReactionPayload, emoji: Reaction_Payload, userId: string): void {
    this.process(message, (role, guild, member) => {
      debug('Removing role %s from user %s (%s).', role.name, member.user?.username, member.user?.id || userId);
      removeRole(guild.id, userId, role.id, `Self-remove role by user ${userId}.`);
    });
  }

  /**
   * Syncs the reactions to the user, in case the bot was offline.
   * DOES NOT REMOVE ANY ROLES.
   */
  async syncReactions(guild: Guild): Promise<void> {
    if (this.syncDone) {
      return;
    }

    this.syncDone = true;

    const userCache: { [key: string]: Member } = {};

    debug('Reaction sync started...');

    await this.configuration.reduce((configurationPromise, configuration) => configurationPromise
        .then(() => guild.channels.get(configuration.channelId))
        .then(channel => {
          if (!channel) {
            throw new Error(`Skipping channel ${configuration.channelId}. Channel was not found in cache.`);
          }

          return channel;
        })
        .then(channel => getMessage(channel, configuration.messageId))
        .then(message => message.reactions && message.reactions
          .filter(reaction => reaction.emoji.name === configuration.emoji)
          .reduce((reactionPromise, reaction) => reactionPromise
              .then(() => getReactions(message, reaction.emoji.name!))
              .then(users => users.reduce((userPromise, userPartial: UserPayload | Member) => userPromise
                  .then(() => userIsUserPayload(userPartial) ? userPartial.id : userPartial.user.id)
                  .then(async userId => userCache[userId] || (userCache[userId] = await getMember(guild.id, userId) as Member))
                  .then(member => ({ member, role: getRoleByName(guild, configuration.roleName)! }))
                  .then(({ member, role }) => {
                    if (!member.roles.includes(role.id)) {
                      debug('Adding role %s to user %s (%s).', role.name, member.user.username, member.user.id);
                      return addRole(guild, member.user.id, role.id, 'Set via Reaction Sync') as Promise<void>;
                    }
                  })
                  .then(() => new Promise(resolve => setTimeout(resolve, 1000))) // wait a bit so the request manager does not get overwhelmed
                , Promise.resolve()))
            , Promise.resolve()))
        .catch((error: Error) => debug(error.message)),
      Promise.resolve());

    debug('Reaction sync done!');
  }

  private process(message: Message | MessageReactionPayload, successCallback: (role: Role, guild: Guild, member: Member) => void) {
    let configuration: ReactionConfiguration | undefined;

    if (!messageIsMessageReactionPayload(message)
      || !cache.guilds.has(message.guild_id)
      || !(configuration = this.getConfigurationForMessage(message.message_id, message.channel_id, message.emoji.name!))
    ) {
      return;
    }

    const guild = cache.guilds.get(message.guild_id)!;
    const role = getRoleByName(guild, configuration.roleName);

    if (!role) {
      debug(`Role ${configuration.roleName} not found.`);
      return;
    }

    successCallback(role, guild, guild.members.get(message.user_id)!);
  }

  private getConfigurationForMessage(messageId: string, channelId: string, emoji: string): ReactionConfiguration | undefined {
    return this.configuration.find(configuration => configuration.messageId === messageId
      && configuration.channelId == channelId
      && configuration.emoji === emoji,
    );
  }
}

function messageIsMessageReactionPayload(message: Message | MessageReactionPayload): message is Required<MessageReactionPayload> {
  const messageAsPayload = message as MessageReactionPayload;
  return !!messageAsPayload.user_id && !!messageAsPayload.guild_id && !!messageAsPayload.message_id && !!messageAsPayload.emoji && !!messageAsPayload.emoji.name;
}

function userIsUserPayload(user: UserPayload | Member): user is UserPayload {
  const userAsPayload = user as UserPayload;

  return !!userAsPayload.id;
}
