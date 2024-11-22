import type { Message } from "./message.js";
import type { MessageResult } from "./messageResult.js";

export type MessageHandler<TMessage extends Message = Message> = (
	data: TMessage["data"],
) => Promise<MessageResult<TMessage>>;
