using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BoundfoxStudios.Data.Database.Models
{
  public class YouTubeNotificationEntityTypeConfiguration : BaseEntityTypeConfiguration<YouTubeNotification>
  {
    protected override void ConfigureEntity(EntityTypeBuilder<YouTubeNotification> builder)
    {
      builder.HasIndex(p => p.HasBeenSentToDiscord);
      builder
        .HasIndex(p => p.VideoId)
        .IsUnique();
    }
  }
}
