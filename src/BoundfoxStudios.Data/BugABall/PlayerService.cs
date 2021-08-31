using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using PlayFab;
using PlayFab.AdminModels;

namespace BoundfoxStudios.Data.BugABall
{
  public class PlayerService
  {
    private readonly ILogger<PlayerService> _logger;
    private readonly PlayFabAdminInstanceAPI _playFab;

    public PlayerService(
      ILogger<PlayerService> logger,
      PlayFabAdminInstanceAPI playFab)
    {
      _logger = logger;
      _playFab = playFab;
    }

    public async Task DeleteAllPlayersAsync()
    {
      _logger.LogInformation("Deleting all players...");

      var continuationToken = string.Empty;
      var loadedProfiles = 0;

      do
      {
        var segmentResult = await _playFab.GetAllSegmentsAsync(new GetAllSegmentsRequest());
        
        if (segmentResult.Error != null)
        {
          _logger.LogError($"{segmentResult.Error.ErrorMessage}");
          throw new Exception(segmentResult.Error.ErrorMessage);
        }

        var segment = segmentResult.Result.Segments.Find(s => s.Name == "All Players");

        if (segment == null)
        {
          _logger.LogError("Segment All Players not found");
          throw new Exception("Segment All Players not found");
        }
        
        var apiResult = await _playFab.GetPlayersInSegmentAsync(new GetPlayersInSegmentRequest()
        {
          SegmentId = segment.Id,
          ContinuationToken = string.IsNullOrWhiteSpace(continuationToken) ? null : continuationToken
        });

        if (apiResult.Error != null)
        {
          _logger.LogError($"{apiResult.Error.ErrorMessage}");
          throw new Exception(apiResult.Error.ErrorMessage);
        }

        loadedProfiles = apiResult.Result.PlayerProfiles.Count;
        continuationToken = apiResult.Result.ContinuationToken;

        foreach (var profile in apiResult.Result.PlayerProfiles)
        {
          _logger.LogDebug($"Deleting Player {profile.PlayerId}...");
          
          var deletedApiResult = await _playFab.DeleteMasterPlayerAccountAsync(new DeleteMasterPlayerAccountRequest()
          {
            PlayFabId = profile.PlayerId
          });

          if (deletedApiResult.Error != null)
          {
            _logger.LogError($"{deletedApiResult.Error.ErrorMessage}");
            throw new Exception(deletedApiResult.Error.ErrorMessage);
          }
          
          _logger.LogDebug($"Deleted Player {profile.PlayerId}s");
        }
      } while (loadedProfiles > 0);


      _logger.LogInformation("Done");
    }
  }
}
