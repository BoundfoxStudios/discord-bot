using System;
using System.Threading;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Extensions;
using BoundfoxStudios.Data.Services;
using Cronos;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.Data.BackgroundServices
{
  public class YouTubeNotificationsBackgroundService : BackgroundService
  {
    private readonly ILogger<YouTubeNotificationsBackgroundService> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly IHostApplicationLifetime _hostApplicationLifetime;
    private readonly IOptionsMonitor<DataOptions> _optionsMonitor;

    private delegate Task ExecuteInScopeDelegate(YouTubeNotificationsService service, string channelId, string callbackUrl);
    
    public YouTubeNotificationsBackgroundService(ILogger<YouTubeNotificationsBackgroundService> logger, 
      IServiceProvider serviceProvider, 
      IHostApplicationLifetime hostApplicationLifetime,
      IOptionsMonitor<DataOptions> optionsMonitor)
    {
      _logger = logger;
      _serviceProvider = serviceProvider;
      _hostApplicationLifetime = hostApplicationLifetime;
      _optionsMonitor = optionsMonitor;
    }
    
    private CronExpression LoadCronExpression()
    {
      return CronExpression.Parse(_optionsMonitor.CurrentValue.YouTubeNotifications.ResubscribeIntervalCronExpression);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
      await ResubscribeIntervalAsync(stoppingToken);
    }

    public override async Task StartAsync(CancellationToken cancellationToken)
    {
      _logger.LogInformation("Starting...");
      
      _hostApplicationLifetime.ApplicationStarted.Register(async () => await ExecuteInScopeAsync(async (service, channelId, callbackUrl) => await service.SubscribeAsync(channelId, callbackUrl)));
      
      await base.StartAsync(cancellationToken);
    }

    private async Task ResubscribeIntervalAsync(CancellationToken cancellationToken)
    {
      while (!cancellationToken.IsCancellationRequested)
      {
        var waitTimeInMilliseconds = LoadCronExpression().GetNextWaitTime();

        if (!waitTimeInMilliseconds.HasValue)
        {
          _logger.LogWarning("No ResubscribeInterval set");
          break;
        }
        
        _logger.LogInformation("Will run in {0:0.00} minutes", TimeSpan.FromMilliseconds(waitTimeInMilliseconds.Value).TotalMinutes);
        await Task.Delay(waitTimeInMilliseconds.Value, cancellationToken);

        if (cancellationToken.IsCancellationRequested)
        {
          break;
        }
        
        _logger.LogInformation("Resubscribing...");
        await ExecuteInScopeAsync(async (service, channelId, callbackUrl) => await service.SubscribeAsync(channelId, callbackUrl));
      }
    }

    private async Task ExecuteInScopeAsync(ExecuteInScopeDelegate serviceFunc)
    {
      using (var scope = _serviceProvider.CreateScope())
      {
        var options = scope.ServiceProvider.GetRequiredService<IOptions<DataOptions>>();
        var youtubeNotificationsService = scope.ServiceProvider.GetRequiredService<YouTubeNotificationsService>();

        var youtubeNotificationsConfiguration = options.Value.YouTubeNotifications;

        foreach (var configuration in youtubeNotificationsConfiguration.Channels)
        {
          await serviceFunc(youtubeNotificationsService, configuration.ChannelId, youtubeNotificationsConfiguration.CallbackUrl);
        }
      }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
      _logger.LogInformation("Stopping...");
      
      await ExecuteInScopeAsync(async (service, channelId, callbackUrl) => await service.UnsubscribeAsync(channelId, callbackUrl));
      
      await base.StopAsync(cancellationToken);
    }
  }
}
