using System.Linq;
using Discord;
using Discord.WebSocket;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.DiscordBot.Services
{
  public class ReactionService
  {
    private readonly ILogger<ReactionService> _logger;
    private readonly IOptionsMonitor<DiscordBotOptions> _options;

    public ReactionService(ILogger<ReactionService> logger, IOptionsMonitor<DiscordBotOptions> options)
    {
      _logger = logger;
      _options = options;
    }
    
    public (IRole Role, SocketGuildUser User, ModuleConfiguration.ReactionModuleConfiguration.Reaction Configuration) Process(Cacheable<IUserMessage, ulong> message, ISocketMessageChannel channel, SocketReaction reaction)
    {
      if (!reaction.User.IsSpecified || !(reaction.User.Value is SocketGuildUser guildUser))
      {
        _logger.LogWarning("No user specified for {ChannelId} {MessageId} {Emoji}", channel.Id, message.Id, reaction.Emote.Name);
        return (null, null, null);
      }

      var configuration = GetConfigurationForMessage(reaction.Emote.Name, message.Id, channel.Id);

      if (configuration == null)
      {
        _logger.LogWarning("No configuration found for {ChannelId} {MessageId} {Emoji}", channel.Id, message.Id, reaction.Emote.Name);
        return (null, null, null);
      }

      return (guildUser.Guild.GetRole(configuration.RoleId), guildUser, configuration);
    }

    private ModuleConfiguration.ReactionModuleConfiguration.Reaction GetConfigurationForMessage(string emoji, ulong messageId, ulong channelId)
    {
      return _options.CurrentValue.Modules.Reactions.Items.SingleOrDefault(
        reaction => reaction.Emoji == emoji && reaction.MessageId == messageId && reaction.ChannelId == channelId
      );
    }
  }
}
