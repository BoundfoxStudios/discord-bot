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
    private bool _isEnabled;

    protected EnableableModule(IOptionsMonitor<DiscordBotOptions> options, ILogger<EnableableModule> logger, DiscordSocketClient client)
    {
      Options = options;
      Logger = logger;
      Client = client;
    }

    public void Dispose()
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

      if (_isEnabled && !newEnabledStatus)
      {
        Logger.LogInformation("Disabling module...");
        _isEnabled = false;
        Disable();
        return;
      }

      if (!_isEnabled && newEnabledStatus)
      {
        Logger.LogInformation("Enabling module...");
        _isEnabled = true;
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
