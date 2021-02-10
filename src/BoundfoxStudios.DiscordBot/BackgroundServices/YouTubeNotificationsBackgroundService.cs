using System;
using System.Threading;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Extensions;
using BoundfoxStudios.Data.Services;
using BoundfoxStudios.DiscordBot.Extensions;
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
  public class YouTubeNotificationsBackgroundService : BackgroundService
  {
    private readonly ILogger<YouTubeNotificationsBackgroundService> _logger;
    private readonly IOptionsMonitor<DiscordBotOptions> _optionsMonitor;
    private readonly IServiceProvider _serviceProvider;
    private readonly IDisposable _onChangeHandler;
    private bool IsEnabled { get; set; }
    private CronExpression _cronExpression;

    public YouTubeNotificationsBackgroundService(
      ILogger<YouTubeNotificationsBackgroundService> logger,
      IOptionsMonitor<DiscordBotOptions> optionsMonitor,
      IServiceProvider serviceProvider
    )
    {
      _logger = logger;
      _optionsMonitor = optionsMonitor;
      _serviceProvider = serviceProvider;

      _onChangeHandler = optionsMonitor.OnChange(options =>
      {
        IsEnabled = options.Modules.YouTubeNotifications.IsEnabled;
        _cronExpression = LoadCronExpression(options.Modules.YouTubeNotifications);
        _logger.LogInformation("Setting new enabled state: {0}", IsEnabled);
      });

      _cronExpression = LoadCronExpression(optionsMonitor.CurrentValue.Modules.YouTubeNotifications);
      IsEnabled = optionsMonitor.CurrentValue.Modules.YouTubeNotifications.IsEnabled;
      _logger.LogInformation("Setting new enabled state: {0}", IsEnabled);
    }

    private CronExpression LoadCronExpression(ModuleConfiguration.YouTubeNotificationsModuleConfiguration configuration)
    {
      return CronExpression.Parse(configuration.CronExpression);
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
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

          _logger.LogInformation("Checking YouTube notifications...");

          using (var scope = _serviceProvider.CreateScope())
          {
            var discordClient = scope.ServiceProvider.GetRequiredService<DiscordSocketClient>();
            var youTubeNotificationsService = scope.ServiceProvider.GetRequiredService<YouTubeNotificationsService>();

            var notificationsToSend = await youTubeNotificationsService.GetUnsentNotifications();
            var options = _optionsMonitor.CurrentValue.Modules.YouTubeNotifications;
            var channel = (IMessageChannel) discordClient.GetChannel(options.AnnouncementChannelId);

            foreach (var notification in notificationsToSend)
            {
              var message = $"Hey {MentionUtils.MentionRole(options.AnnouncementRoleId)} @here!\n\n" +
                            $"{TextUtils.Bold(notification.Author)} has uploaded a new video: {TextUtils.Bold(notification.Title)}\n\n" +
                            $"Check it out here: {notification.Url}";

              await channel.SendMessageAsync(message);
              await youTubeNotificationsService.UpdateStatusToSent(notification);
            }
          }
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

    ~YouTubeNotificationsBackgroundService()
    {
      Dispose();
    }
  }
}
