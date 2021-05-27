using System;
using System.Collections.Generic;

namespace BoundfoxStudios.DiscordBot
{
  public interface IEnableableModuleConfiguration
  {
    bool IsEnabled { get; set; }
  }

  public class DiscordBotOptions
  {
    public string Token { get; set; }
    public ulong LogChannelId { get; set; }
    public int MessageCacheSize { get; set; }
    public bool AlwaysDownloadUsers { get; set; }

    public ModuleConfiguration Modules { get; set; }
  }

  public class ModuleConfiguration
  {
    public EventLoggerModuleConfigurationConfiguration EventLogger { get; set; }
    public WelcomeModuleConfigurationConfiguration Welcome { get; set; }
    public ReactionModuleConfiguration Reactions { get; set; }
    public StatisticsModuleConfiguration Statistics { get; set; }
    public YouTubeNotificationsModuleConfiguration YouTubeNotifications { get; set; }

    public class EventLoggerModuleConfigurationConfiguration : IEnableableModuleConfiguration
    {
      public bool LogPrivateMessages { get; set; }
      public bool IsEnabled { get; set; }
    }

    public class WelcomeModuleConfigurationConfiguration : IEnableableModuleConfiguration
    {
      public ulong WelcomeChannelId { get; set; }
      public bool IsEnabled { get; set; }
      public ulong RulesChannelId { get; set; }
      public ulong RolesChannelId { get; set; }
      public ulong AnnouncementChannelId { get; set; }
    }

    public class ReactionModuleConfiguration : IEnableableModuleConfiguration
    {
      public IReadOnlyCollection<Reaction> Items { get; set; }
      public int ReactionSyncDelay { get; set; }
      public bool IsEnabled { get; set; }

      public class Reaction
      {
        public ulong ChannelId { get; set; }
        public ulong MessageId { get; set; }
        public ulong RoleId { get; set; }
        public string Emoji { get; set; }
      }
    }

    public class StatisticsModuleConfiguration : IEnableableModuleConfiguration
    {
      public bool IsEnabled { get; set; }
      public string CronExpression { get; set; }
    }

    public class YouTubeNotificationsModuleConfiguration : IEnableableModuleConfiguration
    {
      public bool IsEnabled { get; set; }
      public string CronExpression { get; set; }
      public ulong AnnouncementChannelId { get; set; }
      public ulong AnnouncementRoleId { get; set; }
    }
  }
}
