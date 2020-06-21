import { Message } from '../../deps.ts';
import { Command } from './command.ts';

export interface LinksCommandConfiguration {
  managementRoleIds: string[];
  defaultCategories: string[];
}

export class LinksCommand implements Command {
  readonly description = 'TODO';
  readonly name = 'links';

  async execute(message: Message): Promise<void> {

  }
}
