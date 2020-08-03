using BoundfoxStudios.DiscordBot.Commands;
using Discord.Commands;
using Discord.WebSocket;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BoundfoxStudios.DiscordBot.Extensions
{
  public static class ServiceProviderExtensions
  {
    public static void AddDiscordBot(this IServiceCollection services, IConfiguration configureSection)
    {
      services.AddOptions<DiscordBotOptions>().Bind(configureSection);
      services.AddHostedService<DiscordBotHost>();
      services.AddSingleton<DiscordBot>();
      services.AddSingleton<DiscordSocketClient>();
      services.AddSingleton<CommandHandler>();
      services.AddSingleton<CommandService>();
    }
  }
}
