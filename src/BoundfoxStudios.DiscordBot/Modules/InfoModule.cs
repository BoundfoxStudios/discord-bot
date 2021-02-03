using System.Threading.Tasks;
using Discord.WebSocket;
using JetBrains.Annotations;
using Microsoft.Extensions.Logging;

namespace BoundfoxStudios.DiscordBot.Modules
{
  [UsedImplicitly]
  public class InfoModule : IModule
  {
    private readonly DiscordSocketClient _client;
    private readonly ILogger<DiscordBot> _logger;

    public InfoModule(
      ILogger<DiscordBot> logger, // it should log in the context of the DiscordBot
      DiscordSocketClient client
    )
    {
      _client = client;
      _logger = logger;
    }

    public Task InitializeAsync()
    {
      _client.Ready += DiscordClientReadyAsync;

      return Task.CompletedTask;
    }

    private async Task DiscordClientReadyAsync()
    {
      // TODO: where do we get the version from?
      _logger.LogInformation("Setting status...");

      var version = "v0.6.1";

#if DEBUG
      version += "-debug";
#endif

      await _client.SetGameAsync($"!info | {version}");
    }
  }
}
