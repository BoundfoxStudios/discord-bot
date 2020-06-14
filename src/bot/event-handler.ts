import { Configuration } from '../application/configuration.provider.ts';
import { DiTokens } from '../application/di-tokens.ts';
import { EventHandlers, Inject, Injectable, Message, sendMessage } from '../deps.ts';
import { deriveDebug } from '../utils.ts';
import { MessageEmbed } from './message-embed.ts';

const debug = deriveDebug('EventHandler');

@Injectable()
export class EventHandler implements EventHandlers {
  constructor(@Inject(DiTokens.Configuration) private readonly configuration: Configuration) {
  }

  ready() {
    debug('Ready event received.');
  }

  messageCreate(message: Message) {
    if (!message.content.startsWith(this.configuration.discord.prefix)) {
      return;
    }

    debug('Received a potential message...');

    // message.

    sendMessage(message.channel, 'I am alive!');
    sendMessage(message.channel, {
      embed: new MessageEmbed()
        .setAuthor('Author', 'https://google.de', 'https://boundfoxstudios.com/wp-content/uploads/2020/02/cropped-Logo_New-150x150.png')
        .setColor('#ffeb3b')
        .setDescription('Description')
        .setFooter('Footer', 'https://boundfoxstudios.com/wp-content/uploads/2020/02/cropped-Logo_New-150x150.png')
        .setTitle('Title')
        //.setImage('https://boundfoxstudios.com/wp-content/uploads/2020/02/cropped-Logo_New-150x150.png')
        .setThumbnail('https://boundfoxstudios.com/wp-content/uploads/2020/02/cropped-Logo_New-150x150.png')
    });
  }
}
