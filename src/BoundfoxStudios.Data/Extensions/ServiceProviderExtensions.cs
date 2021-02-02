using BoundfoxStudios.Data.BackgroundServices;
using BoundfoxStudios.Data.Database;
using BoundfoxStudios.Data.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

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
      services.AddTransient<UserReminderService>();
      services.AddTransient<StatisticsService>();
      services.AddTransient<YouTubeNotificationsService>();
      services.AddTransient<YouTubeSyndicationReader>();
      
      services.AddHttpClient<YouTubeNotificationsService>();
      
      services.AddHostedService<YouTubeNotificationsBackgroundService>();
    }
  }
}
