using System;
using System.Threading;
using System.Threading.Tasks;
using BoundfoxStudios.Data.BugABall;
using BoundfoxStudios.Data.Extensions;
using BoundfoxStudios.Data.Services;
using Cronos;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.Data.BackgroundServices
{
  public class BugABallBackgroundService : BackgroundService
  {
    private readonly ILogger<BugABallBackgroundService> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly IOptionsMonitor<DataOptions> _optionsMonitor;

    
    public BugABallBackgroundService(ILogger<BugABallBackgroundService> logger, 
      IServiceProvider serviceProvider, 
      IOptionsMonitor<DataOptions> optionsMonitor)
    {
      _logger = logger;
      _serviceProvider = serviceProvider;
      _optionsMonitor = optionsMonitor;
    }
    
    private CronExpression LoadCronExpression()
    {
      return CronExpression.Parse(_optionsMonitor.CurrentValue.BugABall.SetLeaderboardAggregationMethodCronExpression);
    }

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
      while (!cancellationToken.IsCancellationRequested)
      {
        var waitTimeInMilliseconds = LoadCronExpression().GetNextWaitTime();

        if (!waitTimeInMilliseconds.HasValue)
        {
          _logger.LogWarning("No CronExpression set");
          break;
        }
        
        _logger.LogInformation("Will run in {0:0.00} minutes", TimeSpan.FromMilliseconds(waitTimeInMilliseconds.Value).TotalMinutes);
        await Task.Delay(waitTimeInMilliseconds.Value, cancellationToken);

        if (cancellationToken.IsCancellationRequested)
        {
          break;
        }
        
        using (var scope = _serviceProvider.CreateScope())
        {
          var highscoreService = scope.ServiceProvider.GetRequiredService<HighscoreService>();

          await highscoreService.ChangeAggregationMethodOfAllLeaderboardsAsync();
        }
      }
    }

    public override async Task StartAsync(CancellationToken cancellationToken)
    {
      _logger.LogInformation("Starting...");
      
      await base.StartAsync(cancellationToken);
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
      _logger.LogInformation("Stopping...");
      
      await base.StopAsync(cancellationToken);
    }
  }
}
