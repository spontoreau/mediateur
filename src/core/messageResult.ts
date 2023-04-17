import type { Message } from './message';

export type MessageResult<TMessage extends Message> = TMessage extends Message<
  infer TType,
  infer TData,
  infer TResult
>
  ? TResult
  : never;
