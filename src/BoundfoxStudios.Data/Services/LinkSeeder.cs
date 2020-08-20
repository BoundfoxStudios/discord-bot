using System.Threading.Tasks;
using BoundfoxStudios.Data.Database;
using BoundfoxStudios.Data.Database.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.Data.Services
{
  public class LinkSeeder : IDataSeed
  {
    private readonly ILogger<LinkSeeder> _logger;
    private readonly BotDbContext _botDbContext;
    private readonly IOptions<DataOptions> _options;

    public LinkSeeder(ILogger<LinkSeeder> logger, BotDbContext botDbContext, IOptions<DataOptions> options)
    {
      _logger = logger;
      _botDbContext = botDbContext;
      _options = options;
    }
    
    public async Task SeedAsync()
    {
      _logger.LogInformation("Seeding link command...");
      
      if (_options.Value?.Links?.DefaultCategories == null)
      {
        return;
      }

      // TODO: Should this go into the linksservice?
      foreach (var category in _options.Value.Links.DefaultCategories)
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
