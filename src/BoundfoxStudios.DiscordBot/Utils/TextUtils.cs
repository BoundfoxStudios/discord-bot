namespace BoundfoxStudios.DiscordBot.Utils
{
  public static class TextUtils
  {
    public static string Bold(string text)
    {
      return $"**{text}**";
    }

    public static string MessageLink(string text, ulong serverId, ulong channelId, ulong messageId)
    {
      return $"[{text}](https://discordapp.com/channels/{serverId}/{channelId}/{messageId})";
    }
  }
}
