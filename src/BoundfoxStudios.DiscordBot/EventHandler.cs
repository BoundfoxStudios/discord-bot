using System.Threading.Tasks;
using BoundfoxStudios.DiscordBot.Extensions;
using Discord;
using Discord.WebSocket;
using Microsoft.Extensions.Logging;

namespace BoundfoxStudios.DiscordBot
{
  public class EventHandler
  {
    private readonly DiscordSocketClient _client;
    private readonly ReactionManager _reactionManager;
    private readonly ILogger<DiscordBot> _logger;

    public EventHandler(
      ILogger<DiscordBot> logger, // it should log in the context of the DiscordBot
      DiscordSocketClient client,
      ReactionManager reactionManager
      )
    {
      _client = client;
      _reactionManager = reactionManager;
      _logger = logger;
    }

    public void Initialize()
    {
      _client.Log += DiscordClientLogAsync;

      _client.Ready += DiscordClientReadyAsync;

      _client.ReactionAdded += DiscordClientReactionAddedAsync;
      _client.ReactionRemoved += DiscordClientReactionRemovedAsync;

      _client.GuildAvailable += DiscordClientGuildAvailable;
    }

    private Task DiscordClientGuildAvailable(SocketGuild guild)
    {
#pragma warning disable 4014
      _reactionManager.SyncReactionsAsync(guild);
#pragma warning restore 4014

      return Task.CompletedTask;
    }

    private async Task DiscordClientReactionRemovedAsync(Cacheable<IUserMessage, ulong> message, ISocketMessageChannel channel, SocketReaction reaction)
    {
      await _reactionManager.ReactionRemovedAsync(message, channel, reaction);
    }

    private async Task DiscordClientReactionAddedAsync(Cacheable<IUserMessage, ulong> message, ISocketMessageChannel channel, SocketReaction reaction)
    {
      await _reactionManager.ReactionAddedAsync(message, channel, reaction);
    }

    private async Task DiscordClientReadyAsync()
    {
      // TODO: where do we get the version from?
      _logger.LogInformation("Setting status...");
      await _client.SetGameAsync("!info | v0.1");
    }

    private Task DiscordClientLogAsync(LogMessage logMessage)
    {
      _logger.Log(logMessage.Severity.ToLogLevel(), logMessage.Exception, logMessage.Message);

      return Task.CompletedTask;
    }
  }
}
