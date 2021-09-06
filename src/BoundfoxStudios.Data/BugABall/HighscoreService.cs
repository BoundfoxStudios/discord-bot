using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PlayFab;
using PlayFab.AdminModels;

namespace BoundfoxStudios.Data.BugABall
{
  public class HighscoreService
  {
    private readonly ILogger<HighscoreService> _logger;
    private readonly IOptionsMonitor<DataOptions> _optionsMonitor;
    private readonly PlayFabAdminInstanceAPI _playFab;

    public HighscoreService(
      ILogger<HighscoreService> logger,
      IOptionsMonitor<DataOptions> optionsMonitor,
      PlayFabAdminInstanceAPI playFab)
    {
      _logger = logger;
      _optionsMonitor = optionsMonitor;
      _playFab = playFab;
    }

    public async Task ChangeAggregationMethodOfAllLeaderboardsAsync()
    {
      _logger.LogInformation("Changing aggregation method to maximum (we send negative values!)...");

      await IterateStatisticsAsync(async definition => await ChangeAggregationMethodAsync(definition));

      _logger.LogInformation("Done");
    }

    public async Task ResetLeaderboardsAsync()
    {
      _logger.LogInformation("Resetting all leaderboards...");

      await IterateStatisticsAsync(async definition => await ResetLeaderboardAsync(definition));

      _logger.LogInformation("Done");
    }

    private async Task ChangeAggregationMethodAsync(PlayerStatisticDefinition definition)
    {
      if (definition.AggregationMethod == StatisticAggregationMethod.Max ||
          _optionsMonitor.CurrentValue.BugABall.ExcludeFromAggregationMethodChange.Any(exclude =>
            string.Equals(definition.StatisticName, exclude, StringComparison.InvariantCultureIgnoreCase)))
      {
        return;
      }

      _logger.LogInformation($"Updating {definition.StatisticName}...");

      var apiResult = await _playFab.UpdatePlayerStatisticDefinitionAsync(new UpdatePlayerStatisticDefinitionRequest()
      {
        StatisticName = definition.StatisticName,
        AggregationMethod = StatisticAggregationMethod.Max
      });

      if (apiResult.Error != null)
      {
        _logger.LogError($"{apiResult.Error.ErrorMessage}");
        throw new Exception(apiResult.Error.ErrorMessage);
      }

      _logger.LogInformation("Done");
    }

    private async Task ResetLeaderboardAsync(PlayerStatisticDefinition definition)
    {
      _logger.LogInformation($"Resetting definition {definition.StatisticName}...");

      var apiResult = await _playFab.IncrementPlayerStatisticVersionAsync(new IncrementPlayerStatisticVersionRequest()
      {
        StatisticName = definition.StatisticName
      });

      if (apiResult.Error != null)
      {
        _logger.LogError($"{apiResult.Error.ErrorMessage}");
        throw new Exception(apiResult.Error.ErrorMessage);
      }

      _logger.LogInformation("Done!");
    }

    private async Task IterateStatisticsAsync(Func<PlayerStatisticDefinition, Task> callback)
    {
      var apiResult = await _playFab.GetPlayerStatisticDefinitionsAsync(new GetPlayerStatisticDefinitionsRequest());

      if (apiResult.Error != null)
      {
        _logger.LogError(apiResult.Error.ErrorMessage);
        throw new Exception(apiResult.Error.ErrorMessage);
      }

      var definitions = apiResult.Result.Statistics;
      _logger.LogInformation($"Found {definitions.Count} definitions");

      foreach (var definition in definitions)
      {
        await callback(definition);
      }
    }
  }
}
