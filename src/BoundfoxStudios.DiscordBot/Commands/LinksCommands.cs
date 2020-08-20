using System.Linq;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Services;
using BoundfoxStudios.DiscordBot.Extensions;
using Discord;
using Discord.Commands;
using JetBrains.Annotations;
using Microsoft.Extensions.Logging;

namespace BoundfoxStudios.DiscordBot.Commands
{
  [PublicAPI]
  [Group("links")]
  public class LinksCommands : ModuleBase<ICommandContext>
  {
    private readonly LinksService _linksService;
    private readonly ILogger<LinksCommands> _logger;

    public LinksCommands(LinksService linksService, ILogger<LinksCommands> logger)
    {
      _linksService = linksService;
      _logger = logger;
    }

    [Command(null)]
    public async Task CategoryListAsync()
    {
      var categories = await _linksService.ListCategoriesAsync();

      await ReplyAsync(embed: new EmbedBuilder()
        .AsBoundfoxStudiosDefaultMessage()
        .WithDescription("Here are all known categories:")
        .WithFields(
          categories.Select(category => new EmbedFieldBuilder()
            .WithName(category)
            .WithValue($"!links {category}")
          )
        )
        .Build());
    }

    [Command(null)]
    public async Task CategoryLinksAsync(string categoryName)
    {
      var links = (await _linksService.LinksByCategoryAsync(categoryName)).ToList();

      if (links.Count == 0)
      {
        await ReplyAsync("No links yet. Maybe add one? :-)");
        return;
      }

      await ReplyAsync(embed: new EmbedBuilder()
        .AsBoundfoxStudiosDefaultMessage()
        .WithFields(
          links.Select(link => new EmbedFieldBuilder()
            .WithName(link.Title ?? "Link")
            .WithValue(link.Url)
          )
        )
        .Build()
      );
    }

    [Command("add")]
    [RequireUserPermission(GuildPermission.ManageMessages)]
    public async Task AddLinkAsync(string categoryName, string url, [Remainder] string name = null)
    {
      var result = await _linksService.AddLinkAsync(categoryName, url, name);

      if (result)
      {
        await ReplyAsync("Link added!");
        return;
      }

      await ReplyAsync("Adding link failed. Sorry. Maybe category does not exist?");
    }
    
    [Command("remove")]
    [RequireUserPermission(GuildPermission.ManageMessages)]
    public async Task AddLinkAsync(string url)
    {
      var result = await _linksService.RemoveLinkAsync(url);

      if (result)
      {
        await ReplyAsync("Link removed!");
        return;
      }

      await ReplyAsync("Removing link failed. You likely misspelled it.");
    }
  }
}
