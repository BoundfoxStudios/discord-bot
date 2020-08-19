using System.Collections.Generic;

namespace BoundfoxStudios.DiscordBot
{
  public class DiscordBotOptions
  {
    public string Token { get; set; }
    public ReactionManagerOptions ReactionManager { get; set; }
  }

  public class ReactionManagerOptions
  {
    public class Reaction
    {
      public ulong ChannelId {get;set;}
      public ulong MessageId {get;set;}
      public ulong RoleId {get;set;}
      public string Emoji {get;set;}
    }
    
    public IReadOnlyCollection<Reaction> Reactions { get; set; }
    public int ReactionSyncDelay { get; set; }
  }
}
