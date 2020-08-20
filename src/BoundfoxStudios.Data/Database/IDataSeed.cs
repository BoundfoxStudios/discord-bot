using System.Threading.Tasks;

namespace BoundfoxStudios.Data.Database
{
  public interface IDataSeed
  {
    Task SeedAsync();
  }
}
