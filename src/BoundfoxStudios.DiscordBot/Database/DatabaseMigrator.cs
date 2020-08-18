using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Logging;

namespace BoundfoxStudios.DiscordBot.Database
{
  public class DatabaseMigrator
  {
    private readonly BotDbContext _botDbContext;
    private readonly ILogger<DatabaseMigrator> _logger;

    public DatabaseMigrator(BotDbContext botDbContext, ILogger<DatabaseMigrator> logger)
    {
      _botDbContext = botDbContext;
      _logger = logger;
    }

    public async Task MigrateAsync()
    {
      _logger.LogInformation("Migrating database...");
      
      var migrator = _botDbContext.GetService<IMigrator>();
      await migrator.MigrateAsync();
      
      _logger.LogInformation("Migration done.");
    }
  }
}
