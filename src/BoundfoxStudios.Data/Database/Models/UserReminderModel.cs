using System;

namespace BoundfoxStudios.Data.Database.Models
{
  public class UserReminderModel : BaseEntity
  {
    public ulong UserId { get; set; }
    public DateTime JoinedAt { get; set; }
    public int NumberOfNotificationsSent { get; set; }
    public DateTime? LastNotificationSentAt { get; set; }
  }
}
