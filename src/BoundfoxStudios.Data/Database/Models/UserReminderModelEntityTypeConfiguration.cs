using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BoundfoxStudios.Data.Database.Models
{
  public class UserReminderModelEntityTypeConfiguration : BaseEntityTypeConfiguration<UserReminderModel>
  {
    protected override void ConfigureEntity(EntityTypeBuilder<UserReminderModel> builder)
    {
      builder
        .HasIndex(p => p.UserId)
        .IsUnique();
    }
  }
}
