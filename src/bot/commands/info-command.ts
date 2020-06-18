import { Message, sendMessage } from '../../deps.ts';
import { MessageEmbed } from '../message-embed.ts';
import { Command } from './command.ts';

export class InfoCommand implements Command {
  readonly name = 'info';
  readonly description = 'Prints some basic information about the bot.';

  async execute(message: Message): Promise<void> {
    const embed = new MessageEmbed()
      .setUrl('https://github.com/boundfoxstudios/discord-bot')
      .setColor('#ffeb3b')
      .setDescription(
        `Hi! I'm the official Boundfox Studios Bot! I'm an open source discord bot. Feel free to take a look at my code. :-)`,
      )
      .addField('Repository', 'https://github.com/boundfoxstudios/discord-bot')
      .addField('Website', 'https://boundfoxstudios.com')
      .addField('YouTube', 'https://www.youtube.com/c/Boundfox')
      .addField('Patreon', 'https://www.patreon.com/boundfoxstudios')
      .addField('Twitter', 'https://twitter.com/boundfoxstudios')
      .addField('Facebook', 'https://facebook.com/boundfoxstudios')
      .addField('Instagram', 'https://instagram.com/boundfoxstudios');

    sendMessage(message.channel, { embed });
  }
}
