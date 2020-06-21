import { Configuration } from '../../application/configuration.provider.ts';
import { DiTokens } from '../../application/di-tokens.ts';
import { Channel, Inject, Injectable, Member, Message, sendMessage } from '../../deps.ts';
import { LinksService } from '../../services/links-service.ts';
import { deriveDebug } from '../../utils.ts';
import { CommandParser } from '../command-parser.ts';
import { BoundfoxMessageEmbed, ErrorMessageEmbed, MessageEmbed } from '../message-embed.ts';
import { Command } from './command.ts';

const debug = deriveDebug('LinksCommand');

export interface LinksCommandConfiguration {
  managementRoleIds: string[];
  defaultCategories: string[];
}

@Injectable()
export class LinksCommand implements Command {
  readonly description = 'Command to manage some link lists. Use !links to get all category names.';
  readonly name = 'links';
  private readonly configuration: LinksCommandConfiguration;

  constructor(
    @Inject(LinksService) private readonly linksService: LinksService,
    @Inject(CommandParser) private readonly commandParser: CommandParser,
    @Inject(DiTokens.Configuration) configuration: Configuration,
  ) {
    this.configuration = configuration.commands.links;
  }

  async execute({ content, channel, member }: Message): Promise<void> {
    const commands = this.commandParser.parse(content);

    if (!commands.length) {
      return await this.sendCategories(channel);
    }

    const possibleCommand = commands[0].toLowerCase();

    if (possibleCommand === 'add' || possibleCommand === 'remove') {
      return await this.handleElevatedCommand(member(), channel, commands);
    }

    await this.handleLinkRequest(channel, commands);
  }

  private async sendCategories(channel: Channel): Promise<void> {
    debug('Sending categories...');

    const embed = new BoundfoxMessageEmbed()
      .setTitle('Available categories');

    const categories = await this.linksService.listCategories();

    categories.forEach(category => embed.addField(category.name, `!links ${category.name}`));

    sendMessage(channel, { embed });
  }

  private async handleElevatedCommand(member: Member | undefined, channel: Channel, commands: string[]): Promise<void> {
    debug('Handling elevated command %s...', commands[0]);

    if (!member) {
      debug('No member exists.');

      sendMessage(channel, { embed: this.createDefaultErrorMessage() });

      return;
    }

    const { roles } = member;
    const allowedRoleId = this.configuration.managementRoleIds;

    if (!roles || !roles.reduce<boolean>((acc, current) => acc || allowedRoleId.includes(current), false)) {
      sendMessage(channel, {
        embed: new ErrorMessageEmbed()
          .setTitle(`You're not allowed to execute the "!links add" or "!links remove" command.`),
      });
      return;
    }

    const possibleCommand = commands[0].toLowerCase();

    if (possibleCommand === 'add') {
      const [, ...commandOptions] = commands;
      return this.handleLinkAdd(channel, commandOptions);
    }

    if (possibleCommand === 'remove') {
      const [, ...commandOptions] = commands;
      return this.handleLinkRemove(channel, commandOptions);
    }
  }

  private async handleLinkRequest(channel: Channel, [categoryName]: string[]) {
    debug('Handling links request for category %s...', categoryName);

    if (!categoryName) {
      await sendMessage(channel, {
        embed:
          this.createDefaultErrorMessage('Use !links <categoryName>')
            .addField('Missing field', 'categoryName'),
      });
      return;
    }

    const links = await this.linksService.listLinks(categoryName);

    const embed = new BoundfoxMessageEmbed();

    links.forEach(link => embed.addField(link.title || 'Link', link.url));

    await sendMessage(channel, { embed });
  }

  private async handleLinkAdd(channel: Channel, [categoryName, url, name]: string[]): Promise<void> {
    if (!categoryName || !url) {
      const embed = this.createDefaultErrorMessage()
        .setDescription('Use !links add <categoryName> <url> [name]');

      if (!categoryName) {
        embed.addField('Missing field', 'categoryName');
      }

      if (!url) {
        embed.addField('Missing field', 'url');
      }

      await sendMessage(channel, { embed });
      return;
    }

    try {
      await this.linksService.addLink(url, categoryName, name);
      await sendMessage(channel, {
        embed: new BoundfoxMessageEmbed()
          .setTitle('Link added successfully!'),
      });
    } catch (error) {
      debug('Error adding link %s', error);
      await sendMessage(channel, { embed: this.createDefaultErrorMessage(error.toString()) });
    }
  }

  private createDefaultErrorMessage(description?: string): MessageEmbed {
    return new ErrorMessageEmbed()
      .setTitle('Error !links command')
      .setDescription(description || 'Please contact Manu.');
  }

  private async handleLinkRemove(channel: Channel, [url]: string[]): Promise<void> {
    if (!url) {
      await sendMessage(channel, {
        embed: this.createDefaultErrorMessage('Use !links remove <url>')
          .addField('Missing field', url),
      });
      return;
    }

    try {
      await this.linksService.removeLink(url);
      await sendMessage(channel, {
        embed: new BoundfoxMessageEmbed()
          .setTitle('Link removed successfully!'),
      });
    } catch (error) {
      debug('Error removing link %s', error);
      await sendMessage(channel, { embed: this.createDefaultErrorMessage(error.toString()) });
    }
  }
}
