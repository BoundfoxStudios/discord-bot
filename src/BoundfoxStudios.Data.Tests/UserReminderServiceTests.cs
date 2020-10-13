using System;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Database.Models;
using BoundfoxStudios.Data.Services;
using FluentAssertions;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace BoundfoxStudios.Data.Tests
{
  public class UserReminderServiceTests : UserReminderServiceTestsSetup
  {
    [Theory]
    [InlineData(1, -1, 0, null, null)] // joined an hour before
    [InlineData(2, -FirstReminderInDays * 24, 1, null, null)] // joined 24 hours before
    [InlineData(3, null, 0, SecondReminder - 1, 1)] // got a first reminder, but should not get another one, did not hit the second reminder time
    [InlineData(4, null, 1, SecondReminder, 1)] // got a first reminder, hit the second reminder time, gets another reminder
    [InlineData(5, null, 0, SecondReminder, 2)] // got a second reminder, hits the seconds reminder time, no new reminder
    [InlineData(6, null, 0, SecondReminder + 1, 2)] // got a second reminder, hits the seconds reminder time, no new reminder
    [InlineData(7, null, 0, ThirdReminder - 1, 2)] // got a second reminder, is close to third reminder, but wont get it yet
    [InlineData(8, null, 1, ThirdReminder, 2)] // got a second reminder, hits the third reminder, will get a reminder
    [InlineData(9, null, 0, ThirdReminder + 1, 3)] // got a third reminder, is overdue, but does not get a reminder (will not be in the database anymore)
    public async Task Bla(int index, int? joinedAtSeconds, int expected, int? lastNotificationSentAtInSeconds, int? numberOfNotificationsSent)
    {
      await using (var context = await CreateContextAsync())
      {
        var baseDate = DateTime.UtcNow;

        var model = new UserReminderModel()
        {
          UserId = 1,
        };

        if (joinedAtSeconds.HasValue)
        {
          model.JoinedAt = baseDate.AddSeconds(joinedAtSeconds.Value);
        }

        if (lastNotificationSentAtInSeconds.HasValue)
        {
          model.LastNotificationSentAt = baseDate.AddSeconds(-lastNotificationSentAtInSeconds.Value);
        }

        if (numberOfNotificationsSent.HasValue)
        {
          model.NumberOfNotificationsSent = numberOfNotificationsSent.Value;
        }

        await context.UserReminders.AddAsync(model);

        await context.SaveChangesAsync();

        var optionsMock = new Mock<IOptionsMonitor<DataOptions>>();
        optionsMock.Setup(m => m.CurrentValue).Returns(DefaultUserReminderOptions);

        var sut = new UserReminderService(context, optionsMock.Object);

        var reminders = await sut.GetRemindersAsync();

        reminders.Count.Should().Be(expected);
      }
    }
  }
}
