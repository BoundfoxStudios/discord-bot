using BoundfoxStudios.Data.BackgroundServices;
using BoundfoxStudios.Data.BugABall;
using BoundfoxStudios.Data.Database;
using BoundfoxStudios.Data.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using PlayFab;

namespace BoundfoxStudios.Data.Extensions
{
  public static class ServiceProviderExtensions
  {
    public static void AddData(this IServiceCollection services, IConfiguration configureSection)
    {
      services.AddOptions<DataOptions>().Bind(configureSection);

      services.AddDbContext<BotDbContext>(options => options.UseSqlite(configureSection.GetValue<string>(nameof(DataOptions.SqliteConnection))));

      services.AddTransient<IDataSeed, LinkSeeder>();
      services.AddTransient<DatabaseMigrator>();
      services.AddTransient<DatabaseSeeder>();
      services.AddTransient<LinksService>();
      services.AddTransient<StatisticsService>();
      services.AddTransient<YouTubeNotificationsService>();
      services.AddTransient<YouTubeSyndicationReader>();
      
      services.AddSingleton(serviceProvider =>
      {
        var options = serviceProvider.GetRequiredService<IOptions<DataOptions>>();

        return new PlayFabAdminInstanceAPI(new PlayFabApiSettings()
        {
          TitleId = options.Value.BugABall.TitleId,
          DeveloperSecretKey = options.Value.BugABall.DeveloperSecretKey
        });
      });

      services.AddTransient<HighscoreService>();
      services.AddTransient<PlayerService>();
      
      services.AddHttpClient<YouTubeNotificationsService>();
      
      services.AddHostedService<YouTubeNotificationsBackgroundService>();
      services.AddHostedService<BugABallBackgroundService>();
    }
  }
}
