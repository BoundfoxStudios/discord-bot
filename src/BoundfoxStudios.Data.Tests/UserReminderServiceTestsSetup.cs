using System;
using System.Data.Common;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Database;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.Data.Tests
{
  public class UserReminderServiceTestsSetup : IDisposable
  {
    protected const int FirstReminderInDays = 1 * 60 * 60 * 24;
    protected const int SecondReminder = 1 * 60 * 60 * 24 * 2;
    protected const int ThirdReminder = 1 * 60 * 60 * 24 * 7;

    private readonly DbConnection _connection;

    protected readonly DbContextOptions<BotDbContext> ContextOptions = new DbContextOptionsBuilder<BotDbContext>()
      .UseSqlite(CreateInMemoryDatabase())
      .LogTo(Console.WriteLine)
      .Options;

    protected readonly DataOptions DefaultUserReminderOptions = new DataOptions()
    {
      UserReminder = new DataOptions.UserReminderConfiguration
      {
        FirstReminderInSecondsAfterJoining = FirstReminderInDays,
        SecondReminderInSecondsAfterFirstReminder = SecondReminder,
        ThirdReminderInSecondsAfterSecondReminder = ThirdReminder
      }
    };

    protected UserReminderServiceTestsSetup()
    {
      _connection = RelationalOptionsExtension.Extract(ContextOptions).Connection;
    }

    public void Dispose()
    {
      _connection.Dispose();
    }

    private static DbConnection CreateInMemoryDatabase()
    {
      var connection = new SqliteConnection("Filename=:memory:");

      connection.Open();

      return connection;
    }

    protected async Task<BotDbContext> CreateContextAsync()
    {
      var context = new BotDbContext(ContextOptions);

      await context.Database.EnsureDeletedAsync();
      await context.Database.EnsureCreatedAsync();

      return context;
    }
  }
}
