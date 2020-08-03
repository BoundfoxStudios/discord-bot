using Discord;
using Microsoft.Extensions.Logging;

namespace BoundfoxStudios.DiscordBot.Extensions
{
  public static class LogSeverityExtensions
  {
    public static LogLevel ToLogLevel(this LogSeverity logSeverity) =>
      logSeverity switch
      {
        LogSeverity.Verbose =>  LogLevel.Trace,
        LogSeverity.Critical => LogLevel.Critical,
        LogSeverity.Error => LogLevel.Error,
        LogSeverity.Warning => LogLevel.Warning,
        LogSeverity.Info => LogLevel.Information,
        LogSeverity.Debug => LogLevel.Debug,
        _ => LogLevel.Information
      };
  }
}
