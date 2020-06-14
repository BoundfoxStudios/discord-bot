import { Message } from '../../deps.ts';

export interface Command {
  readonly name: string;
  readonly description: string;

  execute(message: Message): Promise<void>;
}
