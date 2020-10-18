using System;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Services;
using BoundfoxStudios.DiscordBot.Services;
using Discord;
using Discord.WebSocket;
using JetBrains.Annotations;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.DiscordBot.Modules
{
  [UsedImplicitly]
  public class UserReminderModule : EnableableModule
  {
    private readonly IServiceProvider _serviceProvider;

    public UserReminderModule(
      IOptionsMonitor<DiscordBotOptions> options,
      ILogger<UserReminderModule> logger,
      DiscordSocketClient client,
      IServiceProvider serviceProvider)
      : base(options, logger, client)
    {
      _serviceProvider = serviceProvider;
    }

    protected override Task InitializeAsyncInternal()
    {
      return Task.CompletedTask;
    }

    protected override void Enable()
    {
      Client.ReactionAdded += ClientReactionAdded;
      Client.ReactionRemoved += ClientReactionRemoved;
      Client.UserJoined += ClientOnUserJoinedAsync;
      Client.UserLeft += ClientOnUserLeftAsync;
    }

    private async Task ClientReactionRemoved(Cacheable<IUserMessage, ulong> message, ISocketMessageChannel channel, SocketReaction reaction)
    {
      using (var scope = _serviceProvider.CreateScope())
      {
        var reactionService = scope.ServiceProvider.GetRequiredService<ReactionService>();

        var (role, user, configuration) = reactionService.Process(message, channel, reaction);

        if (role != null && user != null && configuration.RemoveReminder)
        {
          var userReminderService = scope.ServiceProvider.GetRequiredService<UserReminderService>();
          await userReminderService.AddReminderAsync(user.Id);

          Logger.LogInformation("Adding user {0} to reminder system, because he removed the role.", user.Username);
        }
      }
    }

    private async Task ClientReactionAdded(Cacheable<IUserMessage, ulong> message, ISocketMessageChannel channel, SocketReaction reaction)
    {
      using (var scope = _serviceProvider.CreateScope())
      {
        var reactionService = scope.ServiceProvider.GetRequiredService<ReactionService>();

        var (role, user, configuration) = reactionService.Process(message, channel, reaction);

        if (role != null && user != null && configuration.RemoveReminder)
        {
          var userReminderService = scope.ServiceProvider.GetRequiredService<UserReminderService>();
          await userReminderService.DeleteReminderAsync(user.Id);

          Logger.LogInformation("Removing user {0} from reminder system, because he removed the role.", user.Username);
        }
      }
    }

    private async Task ClientOnUserLeftAsync(SocketGuildUser user)
    {
      using (var scope = _serviceProvider.CreateScope())
      {
        var userReminderService = scope.ServiceProvider.GetRequiredService<UserReminderService>();
        await userReminderService.DeleteReminderAsync(user.Id);
      }
    }

    private async Task ClientOnUserJoinedAsync(SocketGuildUser user)
    {
      using (var scope = _serviceProvider.CreateScope())
      {
        var userReminderService = scope.ServiceProvider.GetRequiredService<UserReminderService>();
        await userReminderService.AddReminderAsync(user.Id);
      }
    }

    protected override void Disable()
    {
      Client.UserJoined -= ClientOnUserJoinedAsync;
      Client.UserLeft -= ClientOnUserLeftAsync;
    }

    protected override IEnableableModuleConfiguration IsEnabledAccessor(DiscordBotOptions options)
    {
      return options.Modules.UserReminder;
    }
  }
}
