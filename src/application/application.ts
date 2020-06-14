import { ApiArea } from '../api/area.ts';
import { CommandHandler } from '../bot/command-handler.ts';
import { Command } from '../bot/commands/command.ts';
import { InfoCommand } from '../bot/commands/info-command.ts';
import { ReactionHandler } from '../bot/reaction-handler.ts';
import { DiscordBot } from '../bot/discord-bot.ts';
import { EventHandler } from '../bot/event-handler.ts';
import { App, container, InjectionToken, instanceCachingFactory } from '../deps.ts';
import { deriveDebug } from '../utils.ts';
import { AlosaurDebugAdapter } from './alosaur-debug-adapter.ts';
import { Configuration, ConfigurationProvider } from './configuration.provider.ts';
import { DiTokens } from './di-tokens.ts';

const debug = deriveDebug('Application');

export class Application {
  private app?: App<any>;

  async initialize(): Promise<void> {
    this.initializeDependencyInjection();

    await AlosaurDebugAdapter.apply();

    this.app = new App({ areas: [ApiArea], logging: true });
  }

  async start(): Promise<void> {
    if (!this.app) {
      debug('Can not start server, did you run initialize?');
      return;
    }

    this.initializeCommander();
    await this.startDiscordBot();
    await this.startHttpServer();
  }

  private initializeCommander(): void {
    const commander = container.resolve(CommandHandler);
    commander.initialize();
  }

  private async startDiscordBot(): Promise<void> {
    const discordBot = container.resolve(DiscordBot);

    await discordBot.start();
  }

  private async startHttpServer(): Promise<void> {
    const configuration = container.resolve<Configuration>(DiTokens.Configuration);

    await this.app!.listen(`:${configuration.server.port}`);
  }

  private initializeDependencyInjection(): void {
    container.registerSingleton(DiscordBot);
    container.registerSingleton(EventHandler);
    container.registerSingleton(CommandHandler);

    this.registerCommands([InfoCommand]);

    container.registerSingleton(ConfigurationProvider);

    container.register(DiTokens.Configuration, {
      useFactory: instanceCachingFactory(resolver => {
        const configurationProvider = resolver.resolve(ConfigurationProvider);
        configurationProvider.initialize();
        return configurationProvider.current;
      }),
    });
  }

  private registerCommands(commands: InjectionToken<Command>[]): void {
    commands.forEach(command => container.registerSingleton(DiTokens.Command, command));
  }
}
