using System;

namespace BoundfoxStudios.Data.Database.Models
{
  public class MemberCountModel : BaseEntity
  {
    public DateTime StatisticTime { get; set; }
    public int MemberCount { get; set; }
    
    public ulong GuildId { get; set; }
  }
}
