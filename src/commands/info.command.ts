import { Message, MessageEmbed, PartialMessage } from 'discord.js';
import { CommandBase } from './command';

export class InfoCommand extends CommandBase {
  async initialize(): Promise<void> {
    await super.initialize(null);

    this.client.on('message', message => this.messageReceived(message));
  }

  private messageReceived(message: Message | PartialMessage): void {
    if (!message.mentions!.has(this.client.user!)) {
      return;
    }

    this.debug('I got mentioned! Sending info...');

    const answer = new MessageEmbed()
      .setURL('https://gitlab.com/boundfox-studios/discord-bot')
      .setColor('#ffeb3b')
      .setDescription(
        `Hi! I'm the official Boundfox Studios Bot!
      I'm an open source discord bot. Feel free to take a look at my code. :-)`,
      )
      .addField('Repository', 'https://gitlab.com/boundfox-studios/discord-bot')
      .addField('Website', 'https://boundfoxstudios.com')
      .addField('YouTube', 'https://www.youtube.com/channel/UCf54CbMEHpI3fXE-SwMg0Ug');

    // eslint-disable-next-line no-unused-expressions
    message.channel?.send(answer);
  }
}
