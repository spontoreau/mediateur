import { Message } from './message';

export type BuildMessage<TMessage extends Message> = (
  data: TMessage['data'],
) => TMessage;

export const getMessageBuilder =
  <TMessage extends Message>(type: TMessage['type']): BuildMessage<TMessage> =>
  (data) => {
    return {
      type,
      data,
    } as TMessage;
  };
