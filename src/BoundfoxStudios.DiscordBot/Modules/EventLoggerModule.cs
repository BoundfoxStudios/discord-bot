using System.Linq;
using System.Threading.Tasks;
using BoundfoxStudios.DiscordBot.Extensions;
using BoundfoxStudios.DiscordBot.Utils;
using Discord;
using Discord.Commands;
using Discord.WebSocket;
using JetBrains.Annotations;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

// TODO: Refactor this ugly thing!

namespace BoundfoxStudios.DiscordBot.Modules
{
  [UsedImplicitly]
  public class EventLoggerModule : EnableableModule
  {
    private readonly DiscordSocketClient _client;
    private readonly CommandService _commandService;

    public EventLoggerModule(
      ILogger<EventLoggerModule> logger, // it should log in the context of the DiscordBot
      DiscordSocketClient client,
      CommandService commandService,
      IOptionsMonitor<DiscordBotOptions> options
    )
      : base(options, logger)
    {
      _client = client;
      _commandService = commandService;
    }

    protected override Task InitializeAsyncInternal()
    {
      return Task.CompletedTask;
    }

    protected override void Enable()
    {
      _client.Log += LogDiscordLogAsync;
      _commandService.Log += LogDiscordLogAsync;

      _client.ChannelCreated += LogChannelCreatedAsync;
      _client.ChannelDestroyed += LogChannelDestroyedAsync;
      _client.GuildMemberUpdated += LogGuildMemberUpdatedAsync;
      _client.UserJoined += LogUserJoinedAsync;
      _client.UserLeft += LogUserLeftAsync;
      _client.UserBanned += LogUserBannedAsync;
      _client.UserUnbanned += LogUserUnbannedAsync;
      _client.MessageDeleted += LogMessageDeletedAsync;
      _client.MessageUpdated += LogMessageUpdatedAsync;
      _client.RoleCreated += LogRoleCreatedAsync;
      _client.RoleDeleted += LogRoleDeletedAsync;
      _client.MessageReceived += LogPrivateMessagesAsync;
    }

    protected override void Disable()
    {
      _client.Log -= LogDiscordLogAsync;
      _commandService.Log -= LogDiscordLogAsync;

      _client.ChannelCreated -= LogChannelCreatedAsync;
      _client.ChannelDestroyed -= LogChannelDestroyedAsync;
      _client.GuildMemberUpdated -= LogGuildMemberUpdatedAsync;
      _client.UserJoined -= LogUserJoinedAsync;
      _client.UserLeft -= LogUserLeftAsync;
      _client.UserBanned -= LogUserBannedAsync;
      _client.UserUnbanned -= LogUserUnbannedAsync;
      _client.MessageDeleted -= LogMessageDeletedAsync;
      _client.MessageUpdated -= LogMessageUpdatedAsync;
      _client.RoleCreated -= LogRoleCreatedAsync;
      _client.RoleDeleted -= LogRoleDeletedAsync;
      _client.MessageReceived -= LogPrivateMessagesAsync;
    }

    protected override IEnableableModuleConfiguration IsEnabledAccessor(DiscordBotOptions options)
    {
      return options.Modules.EventLogger;
    }

    private async Task LogPrivateMessagesAsync(SocketMessage message)
    {
      if (Options.CurrentValue.Modules?.EventLogger == null || !Options.CurrentValue.Modules.EventLogger.LogPrivateMessages)
      {
        return;
      }

      if (!(message.Channel is SocketDMChannel))
      {
        return;
      }

      var builder = CreateDefaultEmbedBuilder(message.Author)
        .WithDescription($"{TextUtils.Bold("Got a private message")}\n{message.Content}")
        .WithFooter($"Author ID: {message.Author.Id}");

      await LogInformationAsync(builder);
    }

    private async Task LogRoleDeletedAsync(SocketRole role)
    {
      var builder = CreateDefaultEmbedBuilder()
        .WithBoldDescription($"Role removed: {role.Name}")
        .WithFooter($"Role ID: {role.Id}");

      await LogDestructiveAsync(builder);
    }

    private async Task LogRoleCreatedAsync(SocketRole role)
    {
      var builder = CreateDefaultEmbedBuilder()
        .WithBoldDescription($"Role created: {role.Name}")
        .WithFooter($"Role ID: {role.Id}");

      await LogSuccessAsync(builder);
    }

    private async Task LogMessageDeletedAsync(Cacheable<IMessage, ulong> deletedMessage, ISocketMessageChannel channel)
    {
      var message = await deletedMessage.GetOrDownloadAsync();

      if (message.Author.IsBot)
      {
        return;
      }

      var builder = CreateDefaultEmbedBuilder(message.Author)
        .WithDescription(
          $"{TextUtils.Bold($"Message sent by {MentionUtils.MentionUser(message.Author.Id)} deleted in {MentionUtils.MentionChannel(channel.Id)}")}\n{message.Content}")
        .WithFooter($"Author ID: {message.Author.Id} | Message ID: {message.Id}");

      await LogInformationAsync(builder);
    }

    private async Task LogMessageUpdatedAsync(Cacheable<IMessage, ulong> cachedOldMessage, SocketMessage newMessage, ISocketMessageChannel channel)
    {
      if (newMessage.Author.IsBot)
      {
        return;
      }

      if (!(channel is SocketGuildChannel guildChannel))
      {
        return;
      }

      var oldMessage = await cachedOldMessage.GetOrDownloadAsync();

      var serverId = guildChannel.Guild.Id;

      var builder = ApplyBeforeAfter(CreateDefaultEmbedBuilder(newMessage.Author), oldMessage.Content, newMessage.Content)
        .WithBoldDescription($"Message edited in {MentionUtils.MentionChannel(channel.Id)}. {TextUtils.MessageLink("Jump to message", serverId, channel.Id, newMessage.Id)}")
        .WithFooter($"Author ID: {newMessage.Author.Id} | Message ID: {newMessage.Id}");

      await LogInformationAsync(builder);
    }

    private async Task LogUserUnbannedAsync(SocketUser user, SocketGuild guild)
    {
      var builder = CreateDefaultEmbedBuilder()
        .WithAuthor(guild.Name, guild.IconUrl)
        .WithBoldDescription($"{MentionUtils.MentionUser(user.Id)} {user.Username} banned.")
        .WithFooter($"User ID: {user.Id}");

      await LogInformationAsync(builder);
    }

    private async Task LogUserBannedAsync(SocketUser user, SocketGuild guild)
    {
      var builder = CreateDefaultEmbedBuilder()
        .WithAuthor(guild.Name, guild.IconUrl)
        .WithBoldDescription($"{MentionUtils.MentionUser(user.Id)} {user.Username} banned.")
        .WithFooter($"User ID: {user.Id}");

      await LogDestructiveAsync(builder);
    }

    private async Task LogUserLeftAsync(SocketGuildUser user)
    {
      var builder = CreateDefaultEmbedBuilder(user)
        .WithBoldDescription($"{MentionUtils.MentionUser(user.Id)} {user.Username} ({user.Nickname}) left.")
        .WithFooter($"User ID: {user.Id}");

      await LogDestructiveAsync(builder);
    }

    private async Task LogUserJoinedAsync(SocketGuildUser user)
    {
      var builder = CreateDefaultEmbedBuilder(user)
        .WithBoldDescription($"{MentionUtils.MentionUser(user.Id)} {user.Username} ({user.Nickname}) joined.")
        .WithFooter($"User ID: {user.Id}");

      await LogSuccessAsync(builder);
    }

    private async Task LogGuildMemberUpdatedAsync(SocketGuildUser beforeUser, SocketGuildUser afterUser)
    {
      var builder = CreateDefaultEmbedBuilder(afterUser);

      if (beforeUser.Nickname != afterUser.Nickname)
      {
        await LogInformationAsync(ApplyBeforeAfter(builder, beforeUser.Nickname, afterUser.Nickname)
          .WithBoldDescription($"{MentionUtils.MentionUser(beforeUser.Id)} changed nickname.")
          .WithFooter($"ID: {beforeUser.Id}"));
        return;
      }

      var removedRoles = beforeUser.Roles.Except(afterUser.Roles).ToList();
      var addedRoles = afterUser.Roles.Except(beforeUser.Roles).ToList();

      if (removedRoles.Count > 0)
      {
        foreach (var role in removedRoles)
        {
          await LogDestructiveAsync(builder
            .WithBoldDescription($"{MentionUtils.MentionUser(beforeUser.Id)} was removed from `{role.Name}` role.")
            .WithFooter($"User ID: {beforeUser.Id} | Role ID: {role.Id}")
          );
        }
      }

      if (addedRoles.Count > 0)
      {
        foreach (var role in addedRoles)
        {
          await LogInformationAsync(builder
            .WithBoldDescription($"{MentionUtils.MentionUser(beforeUser.Id)} was added to `{role.Name}` role.")
            .WithFooter($"User ID: {beforeUser.Id} | Role ID: {role.Id}")
          );
        }
      }
    }

    private EmbedBuilder CreateDefaultEmbedBuilder(IUser author = null)
    {
      var builder = new EmbedBuilder()
        .WithCurrentTimestamp();

      if (author != null)
      {
        builder = builder.WithAuthor(author.Username, author.GetAvatarUrl());
      }

      return builder;
    }

    private EmbedBuilder ApplyBeforeAfter(EmbedBuilder builder, string before, string after)
    {
      return builder.WithFields(
        new EmbedFieldBuilder().WithName("Before").WithValue(string.IsNullOrWhiteSpace(before) ? "-N/A-" : before),
        new EmbedFieldBuilder().WithName("After").WithValue(string.IsNullOrWhiteSpace(after) ? "-N/A-" : after)
      );
    }

    private async Task LogChannelCreatedAsync(SocketChannel channel)
    {
      if (!(channel is SocketGuildChannel))
      {
        return;
      }

      var builder = CreateDefaultEmbedBuilder()
        .WithBoldDescription($"Channel created: {channel.Id}");

      if (channel is SocketGuildChannel guildChannel)
      {
        builder = builder.WithAuthor(guildChannel.Guild.Name, guildChannel.Guild.IconUrl)
          .WithBoldDescription($"Created channel: {guildChannel.Name}");
      }

      await LogSuccessAsync(builder.WithFooter($"Channel ID: {channel.Id}"));
    }

    private async Task LogChannelDestroyedAsync(SocketChannel channel)
    {
      var builder = CreateDefaultEmbedBuilder()
        .WithBoldDescription($"Channel removed: {channel.Id}");

      if (channel is SocketGuildChannel guildChannel)
      {
        builder = builder.WithAuthor(guildChannel.Guild.Name, guildChannel.Guild.IconUrl)
          .WithBoldDescription($"Created removed: {guildChannel.Name}");
      }

      await LogDestructiveAsync(builder.WithFooter($"Channel ID: {channel.Id}"));
    }

    private async Task LogInformationAsync(EmbedBuilder builder)
    {
      await LogAsync(builder.WithInformationColor());
    }

    private async Task LogDestructiveAsync(EmbedBuilder builder)
    {
      await LogAsync(builder.WithErrorColor());
    }

    private async Task LogSuccessAsync(EmbedBuilder builder)
    {
      await LogAsync(builder.WithSuccessColor());
    }

    private async Task LogAsync(EmbedBuilder builder)
    {
      Logger.LogInformation(
        "Author [{0}], Description[{1}], Footer[{2}], Fields [{3}]",
        builder.Author?.Name,
        builder.Description,
        builder.Footer?.Text,
        builder.Fields.Skip(1).Aggregate(builder.Fields.Count > 0 ? $"{builder.Fields[0].Name} ({builder.Fields[0].Value})" : "",
          (s, fieldBuilder) => $"{s} | {fieldBuilder.Name} ({fieldBuilder.Value})")
      );

      if (TryGetMessageChannel(out var messageChannel))
      {
        await messageChannel.SendMessageAsync(embed: builder.Build());
      }
    }

    private bool TryGetMessageChannel(out IMessageChannel messageChannel)
    {
      messageChannel = null;
      var channelId = Options.CurrentValue.LogChannelId;
      var channel = _client.GetChannel(channelId);

      if (channel is IMessageChannel msgChannel)
      {
        messageChannel = msgChannel;
        return true;
      }

      return false;
    }

    private Task LogDiscordLogAsync(LogMessage logMessage)
    {
      Logger.Log(logMessage.Severity.ToLogLevel(), logMessage.Exception, "{0}: {1}", logMessage.Source, logMessage.Message);

      return Task.CompletedTask;
    }
  }
}
