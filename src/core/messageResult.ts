import type { Message } from "./message.js";

export type MessageResult<TMessage extends Message> = TMessage extends Message<
	infer TType,
	infer TData,
	infer TResult
>
	? TResult
	: never;
