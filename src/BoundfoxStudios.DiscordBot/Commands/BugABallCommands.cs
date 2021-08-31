using System;
using System.Threading.Tasks;
using BoundfoxStudios.Data.BugABall;
using Discord;
using Discord.Commands;
using JetBrains.Annotations;

namespace BoundfoxStudios.DiscordBot.Commands
{
  [PublicAPI]
  [Group("bugaball")]
  [RequireUserPermission(GuildPermission.Administrator)]
  public class BugABallCommands : ModuleBase<ICommandContext>
  {
    private readonly HighscoreService _highscoreService;
    private readonly PlayerService _playerService;

    public BugABallCommands(HighscoreService highscoreService, PlayerService playerService)
    {
      _highscoreService = highscoreService;
      _playerService = playerService;
    }

    [Command("reset-all-leaderboards")]
    public async Task ResetAllLeaderboardsAsync()
    {
      await ReplyAsync("Resetting all leaderboards...");

      try
      {
        await _highscoreService.ResetLeaderboardsAsync();
      }
      catch
      {
        await ReplyAsync("Something went wrong. Check server logs. :(");
        return;
      }

      await ReplyAsync("Resetting done!");
    }

    [Command("set-all-leaderboard-aggregation-methods")]
    public async Task SetAllLeaderboardAggregationMethodsAsync()
    {
      await ReplyAsync("Setting all leaderboard aggregation methods");

      try
      {
        await _highscoreService.ChangeAggregationMethodOfAllLeaderboardsAsync();
      }
      catch
      {
        await ReplyAsync("Something went wrong. Check server logs. :(");
        return;
      }

      await ReplyAsync("Setting done!");
    }

    [Command("delete-all-players")]
    public async Task DeleteAllPlayersAsync(string areYouSure, string areYouReallySure)
    {
      if (areYouSure == "yes" && areYouReallySure == "yes")
      {
        await ReplyAsync("Deleting all players. I hope you know, what you're doing...");

        try
        {
          await _playerService.DeleteAllPlayersAsync();
        }
        catch
        {
          await ReplyAsync("Something went wrong. Check server logs. :(");
          return;
        }

        await ReplyAsync("Deleting all players ... done!");
      }
    }
  }
}
