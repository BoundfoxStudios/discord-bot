using System;
using System.Reflection;
using System.Threading.Tasks;
using BoundfoxStudios.DiscordBot.Extensions;
using Discord;
using Discord.Commands;
using Discord.WebSocket;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace BoundfoxStudios.DiscordBot.Commands
{
  public class CommandHandler
  {
    private readonly CommandService _commandService;
    private readonly ILogger<CommandService> _commandServiceLogger;
    private readonly DiscordSocketClient _discordClient;
    private readonly IServiceProvider _serviceProvider;

    public CommandHandler(IServiceProvider serviceProvider)
    {
      _commandServiceLogger = serviceProvider.GetRequiredService<ILogger<CommandService>>();
      _commandService = serviceProvider.GetRequiredService<CommandService>();
      _discordClient = serviceProvider.GetRequiredService<DiscordSocketClient>();
      _serviceProvider = serviceProvider;
    }

    public async Task InitializeAsync()
    {
      _commandService.Log += CommandServiceLog;
      _commandService.CommandExecuted += CommandExecuted;
      _discordClient.MessageReceived += MessageReceived;

      await _commandService.AddModulesAsync(Assembly.GetExecutingAssembly(), _serviceProvider);
    }

    private async Task MessageReceived(SocketMessage rawMessage)
    {
      if (!(rawMessage is SocketUserMessage message))
      {
        return;
      }

      if (message.Source != MessageSource.User)
      {
        return;
      }

      var argPos = 0;

      if (!message.HasCharPrefix('!', ref argPos))
      {
        return;
      }

      var context = new SocketCommandContext(_discordClient, message);
      await _commandService.ExecuteAsync(context, argPos, _serviceProvider);
    }

    private async Task CommandExecuted(Optional<CommandInfo> command, ICommandContext context, IResult result)
    {
      if (!command.IsSpecified)
      {
        return;
      }

      if (result.IsSuccess)
      {
        return;
      }

      await context.Channel.SendMessageAsync($"error: {result}");
    }

    private Task CommandServiceLog(LogMessage logMessage)
    {
      _commandServiceLogger.Log(logMessage.Severity.ToLogLevel(), logMessage.Exception, logMessage.Message);

      return Task.CompletedTask;
    }
  }
}
