using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BoundfoxStudios.DiscordBot.Commands;
using BoundfoxStudios.DiscordBot.Modules;
using Discord;
using Discord.WebSocket;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.DiscordBot
{
  public class DiscordBot : IDisposable
  {
    private readonly ILogger<DiscordBot> _logger;
    private readonly IOptionsMonitor<DiscordBotOptions> _optionsMonitor;
    private readonly DiscordSocketClient _client;
    private readonly CommandHandler _commandHandler;
    private readonly IEnumerable<IModule> _modules;

    public DiscordBot(
      ILogger<DiscordBot> logger,
      IOptionsMonitor<DiscordBotOptions> optionsMonitor,
      DiscordSocketClient discordSocketClient,
      CommandHandler commandHandler,
      IEnumerable<IModule> modules
    )
    {
      _logger = logger;
      _optionsMonitor = optionsMonitor;
      _client = discordSocketClient;
      _commandHandler = commandHandler;
      _modules = modules;
    }

    public async Task StartAsync()
    {
      foreach (var module in _modules)
      {
        _logger.LogInformation($"Initializing {module.GetType().Name}...");
        await module.InitializeAsync();
      }
      
      await _commandHandler.InitializeAsync();
      await LoginAsync();
      await InternalStartAsync();
    }

    private async Task InternalStartAsync()
    {
      _logger.LogInformation("Starting up...");

      await _client.StartAsync();
    }

    public async Task StopAsync()
    {
      await _client.StopAsync();
    }

    private async Task LoginAsync()
    {
      _logger.LogInformation("Logging in...");
      
      await _client.LoginAsync(TokenType.Bot, _optionsMonitor.CurrentValue.Token);
    }

    public void Dispose()
    {
      _client?.Dispose();
    }
  }
}
