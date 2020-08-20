using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BoundfoxStudios.Data.Database.Models
{
  public abstract class BaseEntityTypeConfiguration<T> : IEntityTypeConfiguration<T>
    where T : BaseEntity
  {
    public void Configure(EntityTypeBuilder<T> builder)
    {
      builder.HasKey(p => p.Id);
      
      ConfigureEntity(builder);
    }

    protected abstract void ConfigureEntity(EntityTypeBuilder<T> builder);
  }
}
