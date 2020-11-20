using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BoundfoxStudios.Data.Database.Models
{
  public class MemberCountModelEntityTypeConfiguration : BaseEntityTypeConfiguration<MemberCountModel>
  {
    protected override void ConfigureEntity(EntityTypeBuilder<MemberCountModel> builder)
    {
      builder.HasIndex(p => p.StatisticTime);
    }
  }
}
