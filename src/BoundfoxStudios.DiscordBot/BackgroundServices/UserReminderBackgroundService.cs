using System;
using System.Threading;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Services;
using BoundfoxStudios.DiscordBot.Extensions;
using BoundfoxStudios.DiscordBot.Services;
using BoundfoxStudios.DiscordBot.Utils;
using Cronos;
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

    private CronExpression _cronExpression;

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
        _cronExpression = LoadCronExpression(options.Modules.UserReminder);
        IsEnabled = options.Modules.UserReminder.IsEnabled;
        _logger.LogInformation("Setting new enabled state: {0}", IsEnabled);
      });

      _cronExpression = LoadCronExpression(optionsMonitor.CurrentValue.Modules.UserReminder);
      IsEnabled = optionsMonitor.CurrentValue.Modules.UserReminder.IsEnabled;
      _logger.LogInformation("Setting new enabled state: {0}", IsEnabled);
    }

    private CronExpression LoadCronExpression(ModuleConfiguration.UserReminderModuleConfiguration configuration)
    {
      return CronExpression.Parse(configuration.CronExpression);
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
      var cronExpression = _optionsMonitor.CurrentValue.Modules.UserReminder.CronExpression;

      _logger.LogInformation("Setup periodic user reminder check with CronExpression {0}", cronExpression);

      Task.Run(() => PeriodicUserReminderCheckAsync(stoppingToken), stoppingToken);

      return Task.CompletedTask;
    }

    private async void PeriodicUserReminderCheckAsync(CancellationToken cancellationToken)
    {
      try
      {
        while (!cancellationToken.IsCancellationRequested)
        {
          var waitTimeInMilliseconds = _cronExpression.GetNextWaitTime();

          if (!waitTimeInMilliseconds.HasValue)
          {
            _logger.LogInformation("Could not get wait time. Waiting 30 minutes before retrying...");
            await Task.Delay(TimeSpan.FromMinutes(30), cancellationToken);
            continue;
          }
          
          _logger.LogInformation("Will run in {0:0.00} minutes", TimeSpan.FromMilliseconds(waitTimeInMilliseconds.Value).TotalMinutes);
          await Task.Delay(waitTimeInMilliseconds.Value, cancellationToken);

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
                            $"Please find the rules channel here: {MentionUtils.MentionChannel(_optionsMonitor.CurrentValue.Modules.UserReminder.RulesChannelId)}.\n\n" +
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
