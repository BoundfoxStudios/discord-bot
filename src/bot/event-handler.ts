import { EventHandlers, Injectable, Message } from '../deps.ts';
import { deriveDebug } from '../utils.ts';

const debug = deriveDebug('EventHandler');

@Injectable()
export class EventHandler implements EventHandlers {
  ready() {
    debug('Ready event received.');
  }

  messageCreate(message: Message) {
    console.log(message.content);
  }
}
