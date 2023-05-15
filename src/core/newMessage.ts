import { Message } from './message';

export const newMessage =
  <TMessage extends Message>(type: TMessage['type']) =>
  (data: TMessage['data']): TMessage => {
    return {
      type,
      data,
    } as TMessage;
  };
