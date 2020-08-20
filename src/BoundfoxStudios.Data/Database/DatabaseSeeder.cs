using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace BoundfoxStudios.Data.Database
{
  public class DatabaseSeeder
  {
    private readonly ILogger<DatabaseSeeder> _logger;
    private readonly IEnumerable<IDataSeed> _dataSeeds;

    public DatabaseSeeder(
      ILogger<DatabaseSeeder> logger,
      IEnumerable<IDataSeed> dataSeeds
    )
    {
      _logger = logger;
      _dataSeeds = dataSeeds;
    }

    public async Task SeedAsync()
    {
      _logger.LogInformation("Starting data seeding...");
      
      foreach (var dataSeed in _dataSeeds)
      {
        await dataSeed.SeedAsync();
      }
      
      _logger.LogInformation("Data seeding done.");
    }
  }
}
