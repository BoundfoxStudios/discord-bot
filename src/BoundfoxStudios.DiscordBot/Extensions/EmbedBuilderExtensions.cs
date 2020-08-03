using Discord;

namespace BoundfoxStudios.DiscordBot.Extensions
{
  public static class EmbedBuilderExtensions
  {
    private static readonly Color Yellow = new Color(255, 235, 59);
    private static readonly Color Red = new Color(220, 20, 60);

    public static EmbedBuilder WithBoundfoxStudiosColor(this EmbedBuilder builder)
    {
      return builder.WithColor(Yellow);
    }

    public static EmbedBuilder WithErrorColor(this EmbedBuilder builder)
    {
      return builder.WithColor(Red);
    }

    public static EmbedBuilder AsBoundfoxStudiosDefaultMessage(this EmbedBuilder builder)
    {
      return builder.WithBoundfoxStudiosColor();
    }
  }
}
