using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Sinks.SystemConsole.Themes;

namespace BoundfoxStudios.Host
{
  public class Program
  {
    public static async Task Main(string[] args)
    {
      Log.Logger = new LoggerConfiguration()
        .WriteTo.Console(theme: AnsiConsoleTheme.Code, outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext:l} {Message:lj}{NewLine}{Exception}")
        .WriteTo.File("logs/log.txt", rollingInterval: RollingInterval.Day,
          outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} {Level:u3}] {SourceContext:l} {Message:lj}{NewLine}{Exception}")
        .Enrich.FromLogContext()
        .CreateLogger();

      try
      {
        var host = CreateHostBuilder(args).Build();

        await host.RunAsync();
      }
      finally
      {
        Log.CloseAndFlush();
      }
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
      Microsoft.Extensions.Hosting.Host.CreateDefaultBuilder(args)
        .UseSerilog()
        .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });
  }
}
