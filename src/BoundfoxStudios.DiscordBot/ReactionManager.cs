using System;
using System.Linq;
using System.Threading.Tasks;
using Discord;
using Discord.WebSocket;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.DiscordBot
{
  public class ReactionManager
  {
    private readonly ILogger<ReactionManager> _logger;
    private readonly IOptionsMonitor<DiscordBotOptions> _options;
    private readonly DiscordSocketClient _client;

    public ReactionManager(
      ILogger<ReactionManager> logger,
      IOptionsMonitor<DiscordBotOptions> options,
      DiscordSocketClient client
    )
    {
      _logger = logger;
      _options = options;
      _client = client;
    }

    public async Task ReactionAddedAsync(Cacheable<IUserMessage, ulong> message, ISocketMessageChannel channel, SocketReaction reaction)
    {
      var (role, user) = Process(message, channel, reaction);
      
      if (role != null && user != null)
      {
        _logger.LogInformation("Adding role {Role} ({RoleId}) to user {User} ({UserId})", role.Name, role.Id, user.Username, user.Id);
        await user.AddRoleAsync(role);
      }
    }

    public async Task ReactionRemovedAsync(Cacheable<IUserMessage, ulong> message, ISocketMessageChannel channel, SocketReaction reaction)
    {
      var (role, user) = Process(message, channel, reaction);

      if (role != null && user != null)
      {
        _logger.LogInformation("Removing role {Role} ({RoleId}) from user {User} ({UserId})", role.Name, role.Id, user.Username, user.Id);
        await user.RemoveRoleAsync(role);
      }
    }

    private (IRole Role, SocketGuildUser User) Process(Cacheable<IUserMessage, ulong> message, ISocketMessageChannel channel, SocketReaction reaction)
    {
      if (!reaction.User.IsSpecified || !(reaction.User.Value is SocketGuildUser guildUser))
      {
        _logger.LogWarning("No user specified for for {ChannelId} {MessageId} {Emoji}", channel.Id, message.Id, reaction.Emote.Name);
        return (null, null);
      }

      var configuration = GetConfigurationForMessage(reaction.Emote.Name, message.Id, channel.Id);

      if (configuration == null)
      {
        _logger.LogWarning("No configuration found for {ChannelId} {MessageId} {Emoji}", channel.Id, message.Id, reaction.Emote.Name);
        return (null, null);
      }

      return (guildUser.Guild.GetRole(configuration.RoleId), guildUser);
    }

    private ReactionManagerOptions.Reaction GetConfigurationForMessage(string emoji, ulong messageId, ulong channelId)
    {
      return _options.CurrentValue.ReactionManager.Reactions.SingleOrDefault(
        reaction => reaction.Emoji == emoji && reaction.MessageId == messageId && reaction.ChannelId == channelId
      );
    }

    public async Task SyncReactionsAsync(IGuild guild)
    {
      _logger.LogInformation("Reaction sync started for guild {Guild}", guild.Name);

      var configurations = _options.CurrentValue.ReactionManager.Reactions;

      foreach (var configuration in configurations)
      {
        var channel = await guild.GetTextChannelAsync(configuration.ChannelId);
        var message = await channel.GetMessageAsync(configuration.MessageId);
        var users = await message.GetReactionUsersAsync(new Emoji(configuration.Emoji), int.MaxValue).FlattenAsync();
        var role = guild.GetRole(configuration.RoleId);

        foreach (var user in users)
        {
          var guildUser = await guild.GetUserAsync(user.Id);

          if (guildUser.RoleIds.Contains(role.Id))
          {
            continue;
          }

          _logger.LogInformation("Adding role {Role} ({RoleId}) to user {User} ({UserId})", role.Name, role.Id, guildUser.Username, guildUser.Id);
          await guildUser.AddRoleAsync(role);
          await Task.Delay(_options.CurrentValue.ReactionManager.ReactionSyncDelay);
        }
      }
      
      _logger.LogInformation("Reaction sync done for guild {Guild}", guild.Name);
    }
  }
}

/*
  /**
   * Syncs the reactions to the user, in case the bot was offline.
   * DOES NOT REMOVE ANY ROLES.
   #1#
  async syncReactions(guild: Guild): Promise<void> {
    if (this.syncDone) {
      return;
    }

    this.syncDone = true;

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
                  .then(async userId => ({ userId, member: guild.members.get(userId) || await getMember(guild.id, userId) }))
                  .then(({ userId, member }) => {
                    if (!member) {
                      throw new Error(`Skipping member ${userId}, not found.`);
                    }

                    return member;
                  })
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

}

function messageIsMessageReactionPayload(message: Message | MessageReactionPayload): message is Required<MessageReactionPayload> {
  const messageAsPayload = message as MessageReactionPayload;
  return !!messageAsPayload.user_id && !!messageAsPayload.guild_id && !!messageAsPayload.message_id && !!messageAsPayload.emoji && !!messageAsPayload.emoji.name;
}

function userIsUserPayload(user: UserPayload | Member): user is UserPayload {
  const userAsPayload = user as UserPayload;

  return !!userAsPayload.id;
}
*/
