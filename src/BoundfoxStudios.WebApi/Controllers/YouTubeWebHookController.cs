using System.IO;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Services;
using Microsoft.AspNetCore.Mvc;

namespace BoundfoxStudios.WebApi.Controllers
{
  [Route("api/webhooks/youtube")]
  [ApiController]
  public class YouTubeWebHookController : ControllerBase
  {
    private readonly YouTubeNotificationsService _youTubeNotificationsService;

    public YouTubeWebHookController(YouTubeNotificationsService youTubeNotificationsService)
    {
      _youTubeNotificationsService = youTubeNotificationsService;
    }
    
    public IActionResult ScheduleAsync([FromQuery(Name = "hub.challenge")] string challenge)
    {
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
