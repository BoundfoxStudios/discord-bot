using System;
using System.Threading.Tasks;
using Discord.WebSocket;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BoundfoxStudios.DiscordBot.Modules
{
  public abstract class EnableableModule : IModule, IDisposable
  {
    protected readonly ILogger<EnableableModule> Logger;
    protected readonly DiscordSocketClient Client;
    protected readonly IOptionsMonitor<DiscordBotOptions> Options;

    private IDisposable _onChangeHandler;
    protected bool IsEnabled { get; private set; }

    protected EnableableModule(IOptionsMonitor<DiscordBotOptions> options, ILogger<EnableableModule> logger, DiscordSocketClient client)
    {
      Options = options;
      Logger = logger;
      Client = client;
    }

    public virtual void Dispose()
    {
      _onChangeHandler?.Dispose();
    }

    public async Task InitializeAsync()
    {
      InitializeOptions();

      await InitializeAsyncInternal();
    }

    private void InitializeOptions()
    {
      _onChangeHandler = Options.OnChange(EnableOrDisableModule);

      EnableOrDisableModule(Options.CurrentValue);
    }

    private void EnableOrDisableModule(DiscordBotOptions options)
    {
      var newEnabledStatus = IsEnabledAccessor(options).IsEnabled;

      if (IsEnabled && !newEnabledStatus)
      {
        Logger.LogInformation("Disabling module...");
        IsEnabled = false;
        Disable();
        return;
      }

      if (!IsEnabled && newEnabledStatus)
      {
        Logger.LogInformation("Enabling module...");
        IsEnabled = true;
        Enable();
      }
    }

    protected abstract Task InitializeAsyncInternal();
    protected abstract void Enable();
    protected abstract void Disable();
    protected abstract IEnableableModuleConfiguration IsEnabledAccessor(DiscordBotOptions options);

    ~EnableableModule()
    {
      Dispose();
    }
  }
}
