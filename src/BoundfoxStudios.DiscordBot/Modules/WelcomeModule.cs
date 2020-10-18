using System;
using System.Threading.Tasks;
using Discord;
using Discord.WebSocket;
using JetBrains.Annotations;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.DiscordBot.Modules
{
  [UsedImplicitly]
  public class WelcomeModule : EnableableModule
  {
    public WelcomeModule(IOptionsMonitor<DiscordBotOptions> options, ILogger<WelcomeModule> logger, DiscordSocketClient client) : base(options, logger, client) { }

    protected override Task InitializeAsyncInternal() => Task.CompletedTask;

    protected override void Enable()
    {
      Client.UserJoined += WelcomeUser;
    }

    private async Task WelcomeUser(SocketGuildUser user)
    {
      if (!(Client.GetChannel(Options.CurrentValue.Modules.Welcome.WelcomeChannelId) is IMessageChannel channel))
      {
        return;
      }

      var rulesChannelId = Options.CurrentValue.Modules.Welcome.RulesChannelId;
      var rolesChannelId = Options.CurrentValue.Modules.Welcome.RolesChannelId;
      
      await channel.SendMessageAsync($"Hi {MentionUtils.MentionUser(user.Id)}! Welcome to Boundfox Studios. Please read the {MentionUtils.MentionChannel(rulesChannelId)} and accept them. After that, you'll gain full access to the server. And don't forget to set your own roles in {MentionUtils.MentionChannel(rolesChannelId)}. :-)");
    }

    protected override void Disable()
    {
      Client.UserJoined -= WelcomeUser;
    }

    protected override IEnableableModuleConfiguration IsEnabledAccessor(DiscordBotOptions options)
    {
      return options.Modules.Welcome;
    }
  }
}
