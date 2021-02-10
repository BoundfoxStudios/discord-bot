using System;
using Cronos;

namespace BoundfoxStudios.Data.Extensions
{
  public static class CronExpressionExtensions
  {
    public static int? GetNextWaitTime(this CronExpression expression)
    {
      return expression.GetNextWaitTime(DateTime.UtcNow);
    }
    
    public static int? GetNextWaitTime(this CronExpression expression, DateTime fromUtc)
    {
      var cronTime = expression.GetNextOccurrence(fromUtc);

      if (!cronTime.HasValue)
      {
        return null;
      }

      var deltaTime = cronTime.Value.Ticks - DateTime.UtcNow.Ticks;

      return (int) TimeSpan.FromTicks(deltaTime).TotalMilliseconds;
    }
  }
}
