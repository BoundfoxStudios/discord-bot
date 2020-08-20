using System.Collections.Generic;

namespace BoundfoxStudios.Data.Database.Models
{
  public class LinkCategoryModel : BaseEntity
  {
    public string Name { get; set; }
    public ICollection<LinkModel> Links { get; set; }
  }
}
