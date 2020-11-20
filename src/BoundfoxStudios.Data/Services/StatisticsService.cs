using System;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Database;
using BoundfoxStudios.Data.Database.Models;

namespace BoundfoxStudios.Data.Services
{
  public class StatisticsService
  {
    private readonly BotDbContext _dbContext;

    public StatisticsService(BotDbContext dbContext)
    {
      _dbContext = dbContext;
    }
    
    public async Task WriteMemberCountAsync(ulong guildId, int memberCount)
    {
      var dbItem = new MemberCountModel()
      {
        StatisticTime = DateTime.UtcNow,
        MemberCount = memberCount,
        GuildId = guildId,
      };

      await _dbContext.MemberCounts.AddAsync(dbItem);

      await _dbContext.SaveChangesAsync();
    }
  }
}
