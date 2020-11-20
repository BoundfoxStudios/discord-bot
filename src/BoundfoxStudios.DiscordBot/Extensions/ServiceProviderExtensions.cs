using System;
using System.Linq;
using System.Reflection;
using BoundfoxStudios.DiscordBot.BackgroundServices;
using BoundfoxStudios.DiscordBot.Commands;
using BoundfoxStudios.DiscordBot.Modules;
using BoundfoxStudios.DiscordBot.Services;
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
      services.AddHostedService<UserReminderBackgroundService>();
      services.AddHostedService<StatisticsBackgroundService>();

      services.AddSingleton<DiscordBot>();
      services.AddSingleton(DiscordSocketClientFactory);
      services.AddSingleton<CommandHandler>();
      services.AddSingleton<CommandService>();
      services.AddSingleton<ChannelLogger>();

      services.AddTransient<ReactionService>();

      RegisterModules(services);
    }

    private static void RegisterModules(IServiceCollection services)
    {
      var modules = Assembly.GetExecutingAssembly().DefinedTypes
        .Where(type => type.ImplementedInterfaces.Contains(typeof(IModule)))
        .Where(type => !type.IsAbstract)
        .ToList();

      foreach (var module in modules)
      {
        services.AddSingleton(typeof(IModule), module);
      }
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
