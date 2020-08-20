using System.Threading.Tasks;

namespace BoundfoxStudios.DiscordBot.Modules
{
  public interface IModule
  {
    Task InitializeAsync();
  }
}
