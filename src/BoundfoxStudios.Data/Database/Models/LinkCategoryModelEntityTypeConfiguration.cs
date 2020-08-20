using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BoundfoxStudios.Data.Database.Models
{
  public class LinkCategoryModelEntityTypeConfiguration : BaseEntityTypeConfiguration<LinkCategoryModel>
  {
    protected override void ConfigureEntity(EntityTypeBuilder<LinkCategoryModel> builder)
    {
      builder
        .HasMany(p => p.Links)
        .WithOne(p => p.Category)
        .HasForeignKey(p => p.CategoryId);
      
      builder
        .Property(p => p.Name)
        .HasColumnType("TEXT COLLATE NOCASE");
    }
  }
}
