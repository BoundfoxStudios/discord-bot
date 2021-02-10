using System;
using System.Threading;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Extensions;
using BoundfoxStudios.Data.Services;
using BoundfoxStudios.DiscordBot.Extensions;
using BoundfoxStudios.DiscordBot.Services;
using Cronos;
using Discord;
using Discord.WebSocket;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.DiscordBot.BackgroundServices
{
  public class StatisticsBackgroundService : BackgroundService
  {
    private readonly ILogger<StatisticsBackgroundService> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly IDisposable _onChangeHandler;
    private bool IsEnabled { get; set; }
    private CronExpression _cronExpression;

    public StatisticsBackgroundService(
      ILogger<StatisticsBackgroundService> logger,
      IOptionsMonitor<DiscordBotOptions> optionsMonitor,
      IServiceProvider serviceProvider
    )
    {
      _logger = logger;
      _serviceProvider = serviceProvider;

      _onChangeHandler = optionsMonitor.OnChange(options =>
      {
        IsEnabled = options.Modules.Statistics.IsEnabled;
        _cronExpression = LoadCronExpression(options.Modules.Statistics);
        _logger.LogInformation("Setting new enabled state: {0}", IsEnabled);
      });

      _cronExpression = LoadCronExpression(optionsMonitor.CurrentValue.Modules.Statistics);
      IsEnabled = optionsMonitor.CurrentValue.Modules.Statistics.IsEnabled;
      _logger.LogInformation("Setting new enabled state: {0}", IsEnabled);
    }

    private CronExpression LoadCronExpression(ModuleConfiguration.StatisticsModuleConfiguration configuration)
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

          _logger.LogInformation("Writing statistics...");

          using (var scope = _serviceProvider.CreateScope())
          {
            var discordClient = scope.ServiceProvider.GetRequiredService<DiscordSocketClient>();
            var statisticsService = scope.ServiceProvider.GetRequiredService<StatisticsService>();
            var channelLogger = scope.ServiceProvider.GetRequiredService<ChannelLogger>();

            foreach (var guild in discordClient.Guilds)
            {
              await statisticsService.WriteMemberCountAsync(guild.Id, guild.MemberCount);
            }

            await channelLogger.LogAsync(new EmbedBuilder()
              .WithBoundfoxStudiosColor()
              .WithCurrentTimestamp()
              .WithBoldDescription("Wrote statistics.")
            );
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

    ~StatisticsBackgroundService()
    {
      Dispose();
    }
  }
}
