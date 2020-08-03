using System.Threading.Tasks;
using BoundfoxStudios.DiscordBot.Extensions;
using Discord;
using Discord.Commands;

namespace BoundfoxStudios.DiscordBot.Commands
{
  public class MetaCommands : ModuleBase<ICommandContext>
  {
    [Command("info")]
    public async Task Info() => await ReplyAsync(
      embed: new EmbedBuilder()
        .WithBoundfoxStudiosColor()
        .WithDescription("Hi! I'm the official Boundfox Studios Bot! I'm an open source discord bot. Feel free to take a look at my code. :-)")
        .AddField("Repository", "https://github.com/boundfoxstudios/discord-bot")
        .AddField("Website", "https://boundfoxstudios.com")
        .AddField("YouTube", "https://www.youtube.com/c/Boundfox")
        .AddField("Patreon", "https://www.patreon.com/boundfoxstudios")
        .AddField("Twitch", "https://twitch.tv/boundfoxstudios")
        .AddField("Twitter", "https://twitter.com/boundfoxstudios")
        .AddField("Facebook", "https://facebook.com/boundfoxstudios")
        .AddField("Instagram", "https://instagram.com/boundfoxstudios")
        .Build());
  }
}
