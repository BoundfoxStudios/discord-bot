import { Embed, Embed_Author, Embed_Field, Embed_Footer, Embed_Image, Embed_Thumbnail, Embed_Video } from '../deps.ts';

export class MessageEmbed implements Exclude<Embed, 'type' | 'timestamp' | 'provider'> {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  footer?: Embed_Footer;
  image?: Embed_Image;
  thumbnail?: Embed_Thumbnail;
  video?: Embed_Video;
  author?: Embed_Author;
  fields: Embed_Field[] = [];

  setTitle(title: string): MessageEmbed {
    this.validateTextLength('Title', title, 256);

    this.title = title;

    return this;
  }

  setImage(url: string, width?: number, height?: number): MessageEmbed {
    this.validateUrl(url);

    this.image = { url, width, height };

    return this;
  }

  setThumbnail(url: string, width?: number, height?: number): MessageEmbed {
    this.validateUrl(url);

    this.thumbnail = { url, width, height };

    return this;
  }

  setVideo(url: string, width?: number, height?: number): MessageEmbed {
    this.validateUrl(url);

    this.video = { url, width, height };

    return this;
  }

  setAuthor(name: string, url?: string, iconUrl?: string): MessageEmbed {
    if (url) {
      this.validateUrl(url);
    }

    if (iconUrl) {
      this.validateUrl(iconUrl, 'IconUrl');
    }

    this.author = { name, url, icon_url: iconUrl };

    return this;
  }

  setDescription(description: string): MessageEmbed {
    this.validateTextLength('Description', description, 2048);

    this.description = description;

    return this;
  }

  setColor(cssString: string): MessageEmbed;
  setColor(color: number): MessageEmbed;
  setColor(cssStringOrColor: string | number): MessageEmbed {
    let color = cssStringOrColor as number;

    if (typeof cssStringOrColor === 'string') {
      color = parseInt(cssStringOrColor.replace('#', ''), 16);
    }

    if (color < 0 || color > 0xffffff) {
      throw new RangeError(`Color must be in range of 0 - 0xffffff, actual: ${cssStringOrColor}`);
    }

    if (isNaN(color)) {
      throw new TypeError(`Can not convert ${cssStringOrColor} to color`);
    }

    this.color = color;

    return this;
  }

  setFooter(text: string, iconUrl?: string): MessageEmbed {
    this.validateTextLength('Footer', text, 2048);

    if (iconUrl) {
      this.validateUrl(iconUrl, 'IconUrl');
    }

    this.footer = { text, iconURL: iconUrl };

    return this;
  }

  setUrl(url: string): MessageEmbed {
    this.validateUrl(url);

    this.url = url;

    return this;
  }

  addField(name: string, value: string, inline: boolean = false): MessageEmbed {
    this.fields.push({ name, value, inline });

    return this;
  }

  clearFields(): MessageEmbed {
    this.fields.length = 0;

    return this;
  }

  private validateTextLength(name: string, textToValidate: string, maxLength: number): void {
    const textLength = textToValidate.length;

    if (textLength > maxLength) {
      throw new RangeError(`${name} can not be longer than ${maxLength} characters, actual ${textLength}`);
    }
  }

  private validateUrl(url: string, name: string = 'Url'): void {
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      throw new Error(`${name} must start with http(s)://.`);
    }
  }
}

export class BoundfoxMessageEmbed extends MessageEmbed {
  constructor() {
    super();

    this.setUrl('https://github.com/boundfoxstudios/discord-bot');
    this.setColor('#ffeb3b');
    this.setThumbnail('https://raw.githubusercontent.com/BoundfoxStudios/discord-bot/main/assets/bot-thumbnail.png');
  }
}

export class ErrorMessageEmbed extends BoundfoxMessageEmbed {
  constructor() {
    super();

    this.setColor('#dc143c');
  }
}
