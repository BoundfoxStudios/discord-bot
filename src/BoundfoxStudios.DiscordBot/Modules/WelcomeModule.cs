using System;
using System.Threading.Tasks;
using BoundfoxStudios.DiscordBot.Utils;
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

      await channel.SendMessageAsync(
        $"Hi {MentionUtils.MentionUser(user.Id)}! Welcome to Boundfox Studios. Please read the {MentionUtils.MentionChannel(rulesChannelId)} and accept them. After that, you'll gain full access to the server. And don't forget to set your own roles in {MentionUtils.MentionChannel(rolesChannelId)}. :-)");

      var message =
        $"{TextUtils.Italic("English message below.")}\n\n" +
        $"{TextUtils.Bold($"Hi {user.Username}!")}! :-)\n\nWillkommen auf dem {TextUtils.Bold("Boundfox Studios")} Discord Server. Hier sind einige wichtige Informationen für Dich:\n\n" +
        $"{MentionUtils.MentionChannel(Options.CurrentValue.Modules.Welcome.RulesChannelId)}: Hier sind die Regeln. Bitte {TextUtils.Bold("lese und akzeptiere")} sie, ansonsten kannst Du nicht alle Channels auf dem Server sehen und mit der Community in Kontakt treten.\n" +
        $"{MentionUtils.MentionChannel(Options.CurrentValue.Modules.Welcome.AnnouncementChannelId)}: Wichtige Informationen & Ankündigungen.\n" +
        $"{MentionUtils.MentionChannel(Options.CurrentValue.Modules.Welcome.RolesChannelId)}: Hier kannst Du Dir selbst Rollen geben, wenn Du das möchtest.\n\n" +
        $"Viel Spaß bei uns auf dem Server und falls Du Fragen hast, wende Dich gerne ans Team!";

      await user.SendMessageAsync(message);

      message =
        $"{TextUtils.Bold($"Hi {user.Username}!")}! :-)\n\nWelcome to the {TextUtils.Bold("Boundfox Studios")} Discord Server. Here is some important information for you:\n\n" +
        $"{MentionUtils.MentionChannel(Options.CurrentValue.Modules.Welcome.RulesChannelId)}: Here are the rules. Please {TextUtils.Bold("read and accept")} them, otherwise you cannot fully access the server.\n" +
        $"{MentionUtils.MentionChannel(Options.CurrentValue.Modules.Welcome.AnnouncementChannelId)}: Important information & announcements.\n" +
        $"{MentionUtils.MentionChannel(Options.CurrentValue.Modules.Welcome.RolesChannelId)}: Here are some roles that you can self-assign, if you want to.\n\n" +
        $"Have fun at our server, and if you have questions, feel free to ask the team!";

      await user.SendMessageAsync(message);
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
