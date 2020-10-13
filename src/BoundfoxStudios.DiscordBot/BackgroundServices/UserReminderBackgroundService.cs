using System;
using System.Threading;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Services;
using BoundfoxStudios.DiscordBot.Extensions;
using BoundfoxStudios.DiscordBot.Services;
using BoundfoxStudios.DiscordBot.Utils;
using Discord;
using Discord.WebSocket;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.DiscordBot.BackgroundServices
{
  public class UserReminderBackgroundService : BackgroundService
  {
    private readonly ILogger<UserReminderBackgroundService> _logger;
    private readonly IOptionsMonitor<DiscordBotOptions> _optionsMonitor;
    private readonly IServiceProvider _serviceProvider;
    private readonly IDisposable _onChangeHandler;
    private bool IsEnabled { get; set; }

    public UserReminderBackgroundService(
      ILogger<UserReminderBackgroundService> logger,
      IOptionsMonitor<DiscordBotOptions> optionsMonitor,
      IServiceProvider serviceProvider
    )
    {
      _logger = logger;
      _optionsMonitor = optionsMonitor;
      _serviceProvider = serviceProvider;

      _onChangeHandler = optionsMonitor.OnChange(options =>
      {
        IsEnabled = options.Modules.UserReminder.IsEnabled;
        _logger.LogInformation("Setting new enabled state: {0}", IsEnabled);
      });

      IsEnabled = optionsMonitor.CurrentValue.Modules.UserReminder.IsEnabled;
      _logger.LogInformation("Setting new enabled state: {0}", IsEnabled);
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
      var period = _optionsMonitor.CurrentValue.Modules.UserReminder.Period;

      _logger.LogInformation("Setup periodic user reminder check with time {0}", period);

      Task.Run(() => PeriodicUserReminderCheck(stoppingToken), stoppingToken);

      return Task.CompletedTask;
    }

    private async void PeriodicUserReminderCheck(CancellationToken cancellationToken)
    {
      try
      {
        while (!cancellationToken.IsCancellationRequested)
        {
          await Task.Delay(_optionsMonitor.CurrentValue.Modules.UserReminder.Period, cancellationToken);

          cancellationToken.ThrowIfCancellationRequested();

          if (!IsEnabled)
          {
            continue;
          }

          _logger.LogInformation("Starting periodic user reminder check...");

          using (var scope = _serviceProvider.CreateScope())
          {
            var userReminderService = scope.ServiceProvider.GetRequiredService<UserReminderService>();
            var discordClient = scope.ServiceProvider.GetRequiredService<DiscordSocketClient>();
            var channelLogger = scope.ServiceProvider.GetRequiredService<ChannelLogger>();

            var remindersToSend = await userReminderService.GetRemindersAsync();

            foreach (var reminderToSend in remindersToSend)
            {
              await userReminderService.UpdateSentReminderForUser(reminderToSend.UserId);

              var user = discordClient.GetUser(reminderToSend.UserId);

              var message = $"{TextUtils.Bold($"Hi {user.Username}!")}! :-)\n\nYou've joined the {TextUtils.Bold("Boundfox Studios")} Discord Server on " +
                            $"{TextUtils.Italic(reminderToSend.JoinedAt.ToString("yyyy-MM-dd hh:mm"))} and we're {TextUtils.Bold("happy")} to have you!\n\n" +
                            $"However, you've not accepted the rules yet. :-( Without them, you're not able to see all channels and interact with our lovely community.\n\n" +
                            $"Please find the rules channel here: {_optionsMonitor.CurrentValue.Modules.UserReminder.LinkToRulesChannel}.\n\n" +
                            $"See you soon!\n\n" +
                            $"{TextUtils.Italic($"This is reminder {reminderToSend.NumberOfNotificationsSent + 1}/3")}\n" +
                            $"{TextUtils.Spoiler("I'm a bot, please do not respond to me, since I can not read your message.")}";

              await user.SendMessageAsync(message);

              await channelLogger.LogAsync(new EmbedBuilder()
                .WithBoundfoxStudiosColor()
                .WithCurrentTimestamp()
                .WithAuthor(user.Username, user.GetAvatarUrl())
                .WithBoldDescription("Reminding user to accept the rules.")
              );
            }
          }

          _logger.LogInformation("Finished periodic user reminder check.");
        }
      }
      catch (OperationCanceledException)
      {
        // silently catch OCE
      }
    }

    public override void Dispose()
    {
      _onChangeHandler?.Dispose();

      base.Dispose();
    }

    ~UserReminderBackgroundService()
    {
      Dispose();
    }
  }
}
