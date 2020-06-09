import { Client, DMChannel, Message, MessageEmbed, PartialMessage, TextChannel } from 'discord.js';
import { inject, injectable } from 'inversify';
import { DiTokens } from '../di-tokens';
import { Configuration } from '../services/configuration.service';
import { PiwigoService } from '../services/piwigo.service';
import { CommandBase } from './command';

export interface ImageUploadCommandConfiguration {
  allowedChannelNames: string[];
  channelNameToPiwigoId: {
    [key: string]: number;
  };
}

@injectable()
export class ImageUploadCommand extends CommandBase<ImageUploadCommandConfiguration> {
  constructor(
    @inject(DiTokens.DiscordClient) client: Client,
    @inject(DiTokens.Configuration) configuration: Configuration,
    @inject(PiwigoService) private readonly piwigoService: PiwigoService,
  ) {
    super(client, configuration);
  }

  async initialize(configuration: ImageUploadCommandConfiguration): Promise<void> {
    await super.initialize(configuration);

    this.client.on('message', message => void this.messageReceived(message));
  }

  private messageReceived(message: Message | PartialMessage): void {
    const channel = message.guild!.channels.cache.get(message.channel!.id)!;
    const content = message.content!;

    if (content === '!bfs-gallery') {
      return this.sendInfo(message.channel!);
    }

    if (!content.includes('!bfs-gallery')) {
      return;
    }

    if (!this.commandConfiguration.allowedChannelNames.includes(channel.name)) {
      this.debug('Not handling upload command, channel %s is not allowed', channel.name);
      return;
    }

    this.debug('Handling image upload command.');

    if (!message.attachments || !message.attachments.size) {
      return void this.sendErrorMessage(message.channel!, 'I did not find an image. Did you forget it?');
    }

    const imageUrls = message.attachments.map(attachment => attachment.url).filter(url => this.piwigoService.isFileUrlAllowed(url));

    if (!imageUrls.length) {
      return void this.sendErrorMessage(message.channel!, 'I can only upload jpg/jpeg/png/gif files.');
    }

    const imageUrl = imageUrls[0]; // there is only 1 image per message!
    const author = message.author!.username;
    const comment = content.replace('!bfs-gallery', '').trim();

    this.debug('Will upload %d images from %s with comment %s', imageUrls.length, author, comment);

    const uploadRecognizedAnswer = new MessageEmbed()
      .setTitle('Image Upload')
      .setColor('#ffeb3b')
      .setDescription(`You want me to upload your great images? Alright, I'm on it!`)
      .addField('Uploads in queue', this.piwigoService.queuedItemsCount + 1);

    message
      .channel!.send(uploadRecognizedAnswer)
      .then(async botMessage =>
        this.piwigoService
          .upload$(this.commandConfiguration.channelNameToPiwigoId[channel.name], author, comment, imageUrl).toPromise()
          .then(piwigoResult => ({
            botMessage,
            piwigoResult,
          })),
      )
      .then(result => {
        if (!result.piwigoResult) {
          return this.sendErrorMessage(message.channel!);
        }

        return message.channel!.send(
          new MessageEmbed()
            .setTitle('Image Upload')
            .setDescription('Upload successful')
            .setColor('GREEN')
            .addField('Image', result.piwigoResult)
            .addField('Uploads in queue', this.piwigoService.queuedItemsCount),
        );
      })
      .catch(error => {
        this.debug('Something went wrong: %s', error);

        message.channel!.send('Sorry, something went horribly wrong.');
      });
  }

  private sendInfo(channel: TextChannel | DMChannel): void {
    channel.send(
      new MessageEmbed()
        .setTitle('Image Gallery')
        .setURL('https://images.boundfoxstudios.com')
        .setColor('#ffeb3b')
        .setDescription('If you want to take a look at the images the community has uploaded, head over to our image gallery!')
        .addField('Image Gallery', 'https://images.boundfoxstudios.com'),
    );
  }

  private sendErrorMessage(
    channel: TextChannel | DMChannel,
    text = 'Uh oh, there was an error uploading your image, sorry.',
  ): Promise<Message> {
    const messageEmbed = new MessageEmbed()
      .setTitle('Image Upload')
      .setColor('RED')
      .setDescription(text);

    return channel.send(messageEmbed);
  }
}
