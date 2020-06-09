import * as nodeDebug from 'debug';
import { Client } from 'discord.js';
import { Container, interfaces } from 'inversify';
import 'reflect-metadata';
import { Commands } from './commands';
import { CommandBase } from './commands/command';
import { DiTokens } from './di-tokens';
import { Configuration, ConfigurationService } from './services/configuration.service';
import { DiscordService } from './services/discord.service';
import { PiwigoService } from './services/piwigo.service';
import Factory = interfaces.Factory;
import Newable = interfaces.Newable;
import ServiceIdentifier = interfaces.ServiceIdentifier;

const debug = nodeDebug('bot:Main');

const bindToSingletonScope = <T>(serviceIdentifier: ServiceIdentifier<T>, container: Container) => {
  container
    .bind<T>(serviceIdentifier)
    .toSelf()
    .inSingletonScope();
};

const bindCommand = <T extends CommandBase>(command: Newable<T>, container: Container) => {
  container
    .bind<T>(DiTokens.Command)
    .to(command)
    .inSingletonScope();
};

export class Application {
  private readonly container: Container = new Container({ autoBindInjectable: true, skipBaseClassChecks: true });

  initialize(): void {
    debug('Initializing...');

    bindToSingletonScope(ConfigurationService, this.container);
    bindToSingletonScope(DiscordService, this.container);
    bindToSingletonScope(PiwigoService, this.container);

    Commands.forEach(command => bindCommand<CommandBase>(command, this.container));

    this.container.bind<Configuration>(DiTokens.Configuration).toDynamicValue(context => {
      const configurationService = context.container.get(ConfigurationService);
      configurationService.initialize();
      return configurationService.current;
    });

    this.container.bind<Client>(DiTokens.DiscordClient).toDynamicValue(context => {
      const discordService = context.container.get(DiscordService);
      return discordService.discordClient;
    });

    this.container
      .bind<Factory<CommandBase[]>>(DiTokens.CommandProvider)
      .toFactory(context => () => context.container.getAll(DiTokens.Command));
  }

  start(): Promise<void> {
    debug('Starting...');

    const piwigoService = this.container.get(PiwigoService);
    piwigoService.initialize();

    const discordService = this.container.get(DiscordService);

    return discordService.initialize();
  }
}

const application = new Application();
application.initialize();
application.start().then(
  () => debug('Bot is up and running!'),
  err => debug('Something went wrong starting the bot: %s', err),
);
