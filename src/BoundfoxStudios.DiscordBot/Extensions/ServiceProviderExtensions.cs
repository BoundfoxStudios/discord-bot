using BoundfoxStudios.DiscordBot.Commands;
using BoundfoxStudios.DiscordBot.Database;
using BoundfoxStudios.DiscordBot.Services;
using Discord.Commands;
using Discord.WebSocket;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BoundfoxStudios.DiscordBot.Extensions
{
  public static class ServiceProviderExtensions
  {
    public static void AddDiscordBot(this IServiceCollection services, IConfiguration configureSection)
    {
      services.AddOptions<DiscordBotOptions>().Bind(configureSection);

      services.AddDbContext<BotDbContext>(options => options.UseSqlite(configureSection.GetValue<string>("SqliteConnection")));

      services.AddHostedService<DiscordBotHost>();

      services.AddSingleton<DiscordBot>();
      services.AddSingleton<DiscordSocketClient>();
      services.AddSingleton<CommandHandler>();
      services.AddSingleton<CommandService>();
      services.AddSingleton<EventHandler>();
      services.AddSingleton<ReactionManager>();
      
      services.AddTransient<DatabaseMigrator>();
      services.AddTransient<DatabaseSeeder>();
      services.AddTransient<LinksService>();
    }
  }
}
