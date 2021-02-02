using Microsoft.AspNetCore.Mvc;

namespace BoundfoxStudios.WebApi.Controllers
{
  [Route("/api/ping")]
  [ApiController]
  public class PingController : ControllerBase
  {
    [HttpGet]
    public IActionResult Ping()
    {
      return Ok("pong");
    }
  }
}
