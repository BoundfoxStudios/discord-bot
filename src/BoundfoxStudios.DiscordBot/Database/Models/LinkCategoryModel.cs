using System.Collections.Generic;

namespace BoundfoxStudios.DiscordBot.Database.Models
{
  public class LinkCategoryModel : BaseEntity
  {
    public string Name { get; set; }
    public ICollection<LinkModel> Links { get; set; }
  }
}
