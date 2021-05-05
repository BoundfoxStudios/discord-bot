using System.Threading.Tasks;
using BoundfoxStudios.DiscordBot.Extensions;
using BoundfoxStudios.DiscordBot.Utils;
using Discord;
using Discord.Commands;
using JetBrains.Annotations;

namespace BoundfoxStudios.DiscordBot.Commands
{
  [PublicAPI]
  public class MetaCommands : ModuleBase<ICommandContext>
  {
    [Command("info", true)]
    public async Task InfoAsync() => await ReplyAsync(
      embed: new EmbedBuilder()
        .AsBoundfoxStudiosDefaultMessage()
        .WithDescription("Hi! I'm the official Boundfox Studios Bot! I'm an open source discord bot. Feel free to take a look at my code. :-)")
        .AddField("Repository", "https://github.com/boundfoxstudios/discord-bot")
        .AddField("Socials (YT, FB, Twitter, ...)", "https://boundfoxstudios.com/socials")
        .AddField("Patreon", "https://www.patreon.com/boundfoxstudios")
        .Build());

    [Command("screenshot", true)]
    public async Task ScreenshotAsync() => await ReplyAsync(
      embed: new EmbedBuilder()
        .AsBoundfoxStudiosDefaultMessage()
        .WithDescription("How to do screenshots?")
        .AddField("Deutsch", $"Windows: Drücke {TextUtils.Bold("Win+Shift+S")} um einen Screenshot machen.")
        .AddField("English", $"Windows: Press {TextUtils.Bold("Win+Shift+S")} to make a screenshot.")
        .Build()
    );
  }
}
