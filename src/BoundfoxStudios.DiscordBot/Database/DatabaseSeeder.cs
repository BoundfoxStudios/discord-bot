using System.Threading.Tasks;
using BoundfoxStudios.DiscordBot.Database.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.DiscordBot.Database
{
  public class DatabaseSeeder
  {
    private readonly BotDbContext _botDbContext;
    private readonly ILogger<DatabaseSeeder> _logger;
    private readonly IOptions<DiscordBotOptions> _options;

    public DatabaseSeeder(
      BotDbContext botDbContext, 
      IOptions<DiscordBotOptions> options,
      ILogger<DatabaseSeeder> logger
      )
    {
      _botDbContext = botDbContext;
      _logger = logger;
      _options = options;
    }

    public async Task SeedAsync()
    {
      await SeedLinkCommandAsync();
    }

    private async Task SeedLinkCommandAsync()
    {
      _logger.LogInformation("Seeding link command...");
      
      if (_options.Value?.Commands?.Links?.DefaultCategories == null)
      {
        return;
      }

      // TODO: Should this go into the linksservice?
      foreach (var category in _options.Value.Commands.Links.DefaultCategories)
      {
        if (await _botDbContext.LinkCategories.AnyAsync(p => p.Name == category))
        {
          continue;
        }

        var dbCategory = new LinkCategoryModel() { Name = category };

        await _botDbContext.AddAsync(dbCategory);
        await _botDbContext.SaveChangesAsync();
      }
    }
  }
}
