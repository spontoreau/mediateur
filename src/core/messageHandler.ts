import type { Message } from './message';
import { MessageResult } from './messageResult';

export type MessageHandler<TMessage extends Message = Message> = (
  data: TMessage['data'],
) => Promise<MessageResult<TMessage>>;
