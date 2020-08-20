using System;
using BoundfoxStudios.DiscordBot.Commands;
using BoundfoxStudios.DiscordBot.Modules;
using Discord.Commands;
using Discord.WebSocket;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.DiscordBot.Extensions
{
  public static class ServiceProviderExtensions
  {
    public static void AddDiscordBot(this IServiceCollection services, IConfiguration configureSection)
    {
      services.AddOptions<DiscordBotOptions>().Bind(configureSection);
      services.AddHostedService<DiscordBotHost>();

      services.AddSingleton<DiscordBot>();
      services.AddSingleton(DiscordSocketClientFactory);
      services.AddSingleton<CommandHandler>();
      services.AddSingleton<CommandService>();
      services.AddSingleton<EventHandler>();
      services.AddSingleton<EventLoggerModule>();
      services.AddSingleton<ReactionManager>();
    }

    private static DiscordSocketClient DiscordSocketClientFactory(IServiceProvider serviceProvider)
    {
      var options = serviceProvider.GetRequiredService<IOptions<DiscordBotOptions>>();

      return new DiscordSocketClient(new DiscordSocketConfig
      {
        MessageCacheSize = options.Value.MessageCacheSize
      });
    }
  }
}
