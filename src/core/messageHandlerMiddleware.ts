import { Message } from './message';
import { MessageResult } from './messageResult';

export type MessageHandlerMiddleware<TMessage extends Message = Message> = (
  message: TMessage,
  next: () => Promise<MessageResult<TMessage>>,
) => Promise<MessageResult<TMessage>>;
