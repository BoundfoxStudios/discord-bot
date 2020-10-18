using System.Threading.Tasks;
using Discord;
using Discord.WebSocket;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.DiscordBot.Services
{
  public class ChannelLogger
  {
    private readonly IOptionsMonitor<DiscordBotOptions> _options;
    private readonly DiscordSocketClient _client;

    public ChannelLogger(
      IOptionsMonitor<DiscordBotOptions> options,
      DiscordSocketClient client)
    {
      _options = options;
      _client = client;
    }

    public async Task LogAsync(EmbedBuilder builder)
    {
      if (TryGetMessageChannel(out var messageChannel))
      {
        await messageChannel.SendMessageAsync(embed: builder.Build());
      }
    }

    private bool TryGetMessageChannel(out IMessageChannel messageChannel)
    {
      messageChannel = null;
      var channelId = _options.CurrentValue.LogChannelId;
      var channel = _client.GetChannel(channelId);

      if (channel is IMessageChannel msgChannel)
      {
        messageChannel = msgChannel;
        return true;
      }

      return false;
    }
  }
}
