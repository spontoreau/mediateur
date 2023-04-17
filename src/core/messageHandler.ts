import type { Message } from "./message";
import { MessageResult } from "./messageResult";

export type Handler<
  TMessage extends Message = Message> = (data: TMessage['data']) => Promise<MessageResult<TMessage>>;