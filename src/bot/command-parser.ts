import { Injectable } from '../deps.ts';

// TODO: do we really need this?
@Injectable()
export class CommandParser {
  parse(messageContent: string): string[] {
    const [, ...commands] = messageContent.split(' ');

    return commands;
  }
}
