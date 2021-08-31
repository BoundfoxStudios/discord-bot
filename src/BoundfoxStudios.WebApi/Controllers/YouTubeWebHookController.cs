using System.IO;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BoundfoxStudios.WebApi.Controllers
{
  [Route("api/webhooks/youtube")]
  [ApiController]
  public class YouTubeWebHookController : ControllerBase
  {
    private readonly ILogger<YouTubeWebHookController> _logger;
    private readonly YouTubeNotificationsService _youTubeNotificationsService;

    public YouTubeWebHookController(ILogger<YouTubeWebHookController> logger, YouTubeNotificationsService youTubeNotificationsService)
    {
      _logger = logger;
      _youTubeNotificationsService = youTubeNotificationsService;
    }
    
    public IActionResult ScheduleAsync([FromQuery(Name = "hub.challenge")] string challenge)
    {
      _logger.LogInformation("Accepting challenge");
      return Ok(challenge); 
    }
    
    [HttpPost]
    public async Task<IActionResult> TriggerWebHookAsync()
    {
      await _youTubeNotificationsService.ReadNotificationFromStreamAsync(Request.Body);

      return NoContent();
    }
  }
}
