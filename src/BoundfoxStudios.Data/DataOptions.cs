using System.Collections.Generic;

namespace BoundfoxStudios.Data
{
  public class DataOptions
  {
    public string SqliteConnection { get; set; }

    public LinkConfiguration Links { get; set; }
    
    public YouTubeNotificationsConfiguration YouTubeNotifications { get; set; }
    
    public BugABallConfiguration BugABall { get; set; }

    public class LinkConfiguration
    {
      public IReadOnlyCollection<string> DefaultCategories { get; set; }
    }

    public class YouTubeNotificationsConfiguration
    {
      public string ResubscribeIntervalCronExpression { get; set; }
      public string CallbackUrl { get; set; }
      public IReadOnlyCollection<YouTubeConfiguration> Channels { get; set; }
    }
    
    public class YouTubeConfiguration
    {
      public string ChannelId { get; set; }
    }

    public class BugABallConfiguration
    {
      public string TitleId { get; set; }
      public string DeveloperSecretKey { get; set; }
      public string SetLeaderboardAggregationMethodCronExpression { get; set; }
      public IReadOnlyCollection<string> ExcludeFromAggregationMethodChange { get; set; }
    }
  }
}
