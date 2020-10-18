using System;

namespace BoundfoxStudios.Data.DTOs
{
  public class UserReminderDto
  {
    public ulong UserId { get; set; }
    public int NumberOfNotificationsSent { get; set; }
    public DateTime JoinedAt { get; set; }
  }
}
