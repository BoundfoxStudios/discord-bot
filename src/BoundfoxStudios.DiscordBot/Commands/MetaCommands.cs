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

    [Command("upload", true)]
    public async Task UploadAsync() => await ReplyAsync(
      embed: new EmbedBuilder()
        .AsBoundfoxStudiosDefaultMessage()
        .WithDescription("How to upload a Unity project?\r\n[Unity Project Packer Download](https://github.com/BoundfoxStudios/unity-project-packer/releases/tag/latest)")
        .AddField("Deutsch", $"Gehe auf den Link und lade die .exe-Datei herunter. Lege diese dann im Hauptverzeichnis von Deinem Unity-Projekt ab und starte sie.")
        .AddField("English", $"Open the URL and download the .exe file. Place it into your Unity project and run it.")
        .Build()
    );
  }
}
