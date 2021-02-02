using System;
using System.Threading;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.Data.BackgroundServices
{
  public class YouTubeNotificationsBackgroundService : IHostedService
  {
    private readonly ILogger<YouTubeNotificationsBackgroundService> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly IHostApplicationLifetime _hostApplicationLifetime;

    private delegate Task ExecuteInScopeDelegate(YouTubeNotificationsService service, string channelId, string callbackUrl);
    
    public YouTubeNotificationsBackgroundService(ILogger<YouTubeNotificationsBackgroundService> logger, IServiceProvider serviceProvider, IHostApplicationLifetime hostApplicationLifetime)
    {
      _logger = logger;
      _serviceProvider = serviceProvider;
      _hostApplicationLifetime = hostApplicationLifetime;
    }
    
    public Task StartAsync(CancellationToken cancellationToken)
    {
      _logger.LogInformation("Starting...");

      _hostApplicationLifetime.ApplicationStarted.Register(async () => await ExecuteInScopeAsync(async (service, channelId, callbackUrl) => await service.SubscribeAsync(channelId, callbackUrl)));

      return Task.CompletedTask;
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

    public async Task StopAsync(CancellationToken cancellationToken)
    {
      _logger.LogInformation("Stopping...");
      
      await ExecuteInScopeAsync(async (service, channelId, callbackUrl) => await service.UnsubscribeAsync(channelId, callbackUrl));
    }
  }
}
