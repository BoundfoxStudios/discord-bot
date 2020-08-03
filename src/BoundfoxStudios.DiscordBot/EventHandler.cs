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
    private readonly ILogger<DiscordBot> _logger;

    public EventHandler(
      DiscordSocketClient client,
      ILogger<DiscordBot> logger // it should log in the context of the DiscordBot
      )
    {
      _client = client;
      _logger = logger;
    }

    public void Initialize()
    {
      _client.Log += DiscordClientLogAsync;

      _client.Ready += DiscordClientReadyAsync;
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
