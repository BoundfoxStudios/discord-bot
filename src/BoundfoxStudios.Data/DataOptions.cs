using System;
using System.Collections.Generic;

namespace BoundfoxStudios.Data
{
  public class DataOptions
  {
    public string SqliteConnection { get; set; }

    public LinkConfiguration Links { get; set; }

    public UserReminderConfiguration UserReminder { get; set; }

    public YouTubeNotificationsConfiguration YouTubeNotifications { get; set; }

    public class LinkConfiguration
    {
      public IReadOnlyCollection<string> DefaultCategories { get; set; }
    }

    public class UserReminderConfiguration
    {
      public int FirstReminderInSecondsAfterJoining { get; set; }
      public int? SecondReminderInSecondsAfterFirstReminder { get; set; }
      public int? ThirdReminderInSecondsAfterSecondReminder { get; set; }
    }

    public class YouTubeNotificationsConfiguration
    {
      public string CallbackUrl { get; set; }
      public IReadOnlyCollection<YouTubeConfiguration> Channels { get; set; }
    }
    
    public class YouTubeConfiguration
    {
      public string ChannelId { get; set; }
    }
  }
}
