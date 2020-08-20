namespace BoundfoxStudios.Data.Database.Models
{
  public class LinkModel : BaseEntity
  {
    public string Title { get; set; }
    public string Url { get; set; }
    
    public int CategoryId { get; set; }
    public LinkCategoryModel Category { get; set; }
  }
}
