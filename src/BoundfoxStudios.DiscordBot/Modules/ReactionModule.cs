using System;
using System.Linq;
using System.Threading.Tasks;
using BoundfoxStudios.DiscordBot.Services;
using Discord;
using Discord.WebSocket;
using JetBrains.Annotations;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.DiscordBot.Modules
{
  [UsedImplicitly]
  public class ReactionModule : EnableableModule
  {
    private readonly IOptionsMonitor<DiscordBotOptions> _options;
    private readonly ReactionService _reactionService;

    public ReactionModule(
      ILogger<ReactionModule> logger,
      IOptionsMonitor<DiscordBotOptions> options,
      DiscordSocketClient client,
      ReactionService reactionService
    ) : base(options, logger, client)
    {
      _options = options;
      _reactionService = reactionService;
    }

    protected override Task InitializeAsyncInternal()
    {
      return Task.CompletedTask;
    }

    protected override void Enable()
    {
      Client.ReactionAdded += ReactionAddedAsync;
      Client.ReactionRemoved += ReactionRemovedAsync;

      Client.GuildMembersDownloaded += ClientOnGuildMembersDownloaded;
    }

    protected override void Disable()
    {
      Client.ReactionAdded -= ReactionAddedAsync;
      Client.ReactionRemoved -= ReactionRemovedAsync;

      Client.GuildMembersDownloaded -= ClientOnGuildMembersDownloaded;
    }

    protected override IEnableableModuleConfiguration IsEnabledAccessor(DiscordBotOptions options)
    {
      return options.Modules.Reactions;
    }

    private async Task ReactionAddedAsync(Cacheable<IUserMessage, ulong> message, ISocketMessageChannel channel, SocketReaction reaction)
    {
      var (role, user, _) = _reactionService.Process(message, channel, reaction);

      if (role != null && user != null)
      {
        Logger.LogInformation("Adding role {Role} ({RoleId}) to user {User} ({UserId})", role.Name, role.Id, user.Username, user.Id);
        await user.AddRoleAsync(role);
      }
    }

    private async Task ReactionRemovedAsync(Cacheable<IUserMessage, ulong> message, ISocketMessageChannel channel, SocketReaction reaction)
    {
      var (role, user, _) = _reactionService.Process(message, channel, reaction);

      if (role != null && user != null)
      {
        Logger.LogInformation("Removing role {Role} ({RoleId}) from user {User} ({UserId})", role.Name, role.Id, user.Username, user.Id);
        await user.RemoveRoleAsync(role);
      }
    }

    private async Task SyncReactionsAsync(IGuild guild)
    {
      using (Logger.BeginScope("Reaction syncing {Guild}", guild.Name))
      {
        Logger.LogInformation("Starting");
        
        var configurations = _options.CurrentValue.Modules.Reactions.Items;

        foreach (var configuration in configurations)
        {
          using (Logger.BeginScope("Configuration {ChannelId} {Emoji}", configuration.ChannelId, configuration.Emoji))
          {
            Logger.LogInformation("Starting");
            
            var channel = await guild.GetTextChannelAsync(configuration.ChannelId);
            var message = await channel.GetMessageAsync(configuration.MessageId);
            var users = (await message.GetReactionUsersAsync(new Emoji(configuration.Emoji), int.MaxValue).FlattenAsync()).ToArray();
            var role = guild.GetRole(configuration.RoleId);

            var userCount = users.Length;

            for (var i = 0; i < userCount; i++)
            {
              var percentageDone = (int) Math.Floor((float) i / userCount * 100);

              if (percentageDone > 0 && percentageDone % 5 == 0)
              {
                 Logger.LogInformation("{Percentage} % done", percentageDone);
              }

              var user = users[i];
              var guildUser = await guild.GetUserAsync(user.Id);

              if (guildUser == null)
              {
                Logger.LogWarning("GuildUser is null. Something's strange!");
                continue;
              }

              if (guildUser.RoleIds.Contains(role.Id))
              {
                continue;
              }

              Logger.LogInformation("Adding role {Role} ({RoleId}) to user {User} ({UserId})", role.Name, role.Id, guildUser.Username, guildUser.Id);
              await guildUser.AddRoleAsync(role);
              await Task.Delay(_options.CurrentValue.Modules.Reactions.ReactionSyncDelay);
            }

            Logger.LogInformation("Done");
          }
        }

        Logger.LogInformation("Done");
      }
    }

    private Task ClientOnGuildMembersDownloaded(SocketGuild guild)
    {
#pragma warning disable 4014
      SyncReactionsAsync(guild);
#pragma warning restore 4014

      return Task.CompletedTask;
    }
  }
}
