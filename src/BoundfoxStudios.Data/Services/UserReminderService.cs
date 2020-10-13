using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BoundfoxStudios.Data.Database;
using BoundfoxStudios.Data.Database.Models;
using BoundfoxStudios.Data.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.Data.Services
{
  public class UserReminderService
  {
    private readonly BotDbContext _botDbContext;
    private readonly IOptionsMonitor<DataOptions> _options;

    public UserReminderService(BotDbContext botDbContext, IOptionsMonitor<DataOptions> options)
    {
      _botDbContext = botDbContext;
      _options = options;
    }

    public async Task AddReminderAsync(ulong userId)
    {
      var dbUserReminder = new UserReminderModel()
      {
        UserId = userId,
        JoinedAt = DateTime.UtcNow,
      };

      await _botDbContext.AddAsync(dbUserReminder);
      await _botDbContext.SaveChangesAsync();
    }

    public async Task<bool> DeleteReminderAsync(ulong userId)
    {
      var dbUserReminder = await _botDbContext.UserReminders.SingleOrDefaultAsync(p => p.UserId == userId);

      if (dbUserReminder == null)
      {
        return false;
      }

      _botDbContext.UserReminders.Remove(dbUserReminder);

      await _botDbContext.SaveChangesAsync();

      return true;
    }

    public async Task<ICollection<UserReminderDto>> GetRemindersAsync()
    {
      var options = _options.CurrentValue.UserReminder;

      var query = BuildReminderQuery(options.FirstReminderInSecondsAfterJoining, 0);

      if (options.SecondReminderInSecondsAfterFirstReminder.HasValue)
      {
        query = query.Union(BuildReminderQuery(options.SecondReminderInSecondsAfterFirstReminder.Value, 1));
      }

      if (options.ThirdReminderInSecondsAfterSecondReminder.HasValue)
      {
        query = query.Union(BuildReminderQuery(options.ThirdReminderInSecondsAfterSecondReminder.Value, 2));
      }
      
      return await query
        .Select(user => new UserReminderDto()
        {
          UserId = user.UserId,
          NumberOfNotificationsSent = user.NumberOfNotificationsSent,
          JoinedAt = user.JoinedAt
        })
        .ToArrayAsync();
    }

    public async Task UpdateSentReminderForUser(ulong userId)
    {
      var user = await _botDbContext.UserReminders.SingleOrDefaultAsync(u => u.UserId == userId);

      if (user == null)
      {
        return;
      }

      user.NumberOfNotificationsSent++;
      user.LastNotificationSentAt = DateTime.UtcNow;

      if (user.NumberOfNotificationsSent == 3)
      {
        _botDbContext.Remove(user);
      }

      await _botDbContext.SaveChangesAsync();
    }

    private IQueryable<UserReminderModel> BuildReminderQuery(int seconds, uint numberOfNotificationsSent)
    {
      var query = _botDbContext.UserReminders
        .Where(user => user.NumberOfNotificationsSent == numberOfNotificationsSent);

      if (numberOfNotificationsSent == 0)
      {
        query = query
          .Where(user => user.LastNotificationSentAt == null)
          .Where(user => user.JoinedAt <= DateTime.UtcNow.AddSeconds(-seconds));
      }
      else
      {
        query = query.Where(user => user.LastNotificationSentAt <= DateTime.UtcNow.AddSeconds(-seconds));
      }

      return query;
    }
  }
}
