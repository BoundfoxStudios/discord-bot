import { Debugger } from 'debug';
import { Client } from 'discord.js';
import * as nodeDebug from 'debug';
import { inject, injectable } from 'inversify';
import { DiTokens } from '../di-tokens';
import { Configuration } from '../services/configuration.service';

@injectable()
export abstract class CommandBase<T = any> {
  protected readonly debug: Debugger;
  protected commandConfiguration: T;

  constructor(
    @inject(DiTokens.DiscordClient) protected readonly client: Client,
    @inject(DiTokens.Configuration) protected readonly configuration: Configuration,
  ) {
    this.debug = nodeDebug(`bot:${(this as any).constructor.name}`);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async initialize(configuration: T): Promise<void> {
    this.debug('Initializing with config %o', configuration);
    this.commandConfiguration = configuration;
  }
}
