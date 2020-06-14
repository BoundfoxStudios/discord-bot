import { Configuration } from '../application/configuration.provider.ts';
import { DiTokens } from '../application/di-tokens.ts';
import { Inject, Injectable, InjectAll, Message } from '../deps.ts';
import { deriveDebug } from '../utils.ts';
import { Command } from './commands/command.ts';

const debug = deriveDebug('Commander');

@Injectable()
export class CommandHandler {
  private readonly commandMap = new Map<string, Command>();

  constructor(
    @InjectAll(DiTokens.Command) private readonly commands: Command[],
    @Inject(DiTokens.Configuration) private readonly configuration: Configuration,
  ) {
  }

  initialize(): void {
    debug('Initializing...');

    this.commands.forEach(command => {
      if (this.commandMap.has(command.name)) {
        throw new Error(`Command ${command.name} has already been registered!`);
      }

      this.validateCommandName(command.name);

      this.commandMap.set(command.name, command);
      debug('Adding command %s.', command.name);
    });
  }

  process(message: Message): void {
    // Don't process bot messages
    if (message.author.bot) {
      return;
    }

    // Sample command: !info test 123
    // Tries to get the command name info, skipping the prefix and reading the command name until the next empty space.
    // Or the rest of the command, if empty space is not found.
    const lastIndex = message.content.indexOf(' ') > 0 ? message.content.indexOf(' ') - 1 : message.content.length;
    const commandName = message.content.substr(this.configuration.discord.prefix.length, lastIndex);

    debug('Processing command %s.', commandName);

    const command = this.commandMap.get(commandName);

    if (!command) {
      debug('Command %s not found.', commandName);
      return;
    }

    command.execute(message);
  }

  private validateCommandName(commandName: string): void {
    const nameRegEx = /^[a-z-]+$/i;

    if (!nameRegEx.test(commandName)) {
      throw new Error(`Command "${commandName}" has invalid name. It must match regex /^[a-z-]+$/i`);
    }
  }
}
