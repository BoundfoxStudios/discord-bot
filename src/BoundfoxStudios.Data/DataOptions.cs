using System.Collections.Generic;

namespace BoundfoxStudios.Data
{
  public class DataOptions
  {
    public string SqliteConnection { get; set; }
    
    public LinkConfiguration Links { get; set; }
    
    public class LinkConfiguration
    {
      public IReadOnlyCollection<string> DefaultCategories { get; set; }
    }
  }
}
