using System;

namespace BoundfoxStudios.Data.Database.Models
{
  public class YouTubeNotification : BaseEntity
  {
    public string ChannelId { get; set; }
    public string VideoId { get; set; }
    public string Url { get; set; }
    public string Author { get; set; }
    public string Title { get; set; }
    public DateTime PublishDateTime { get; set; }
    public bool HasBeenSentToDiscord { get; set; }
  }
}
