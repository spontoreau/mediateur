import { Message } from './message';
import { MessageHandler } from './messageHandler';
import { MessageResult } from './messageResult';

export type AddOption = {
  middlewares: ReadonlyArray<Middleware>;
};

export type Middleware<TMessage extends Message = Message> = (
  message: TMessage,
  next: () => Promise<MessageResult<TMessage>>,
) => Promise<MessageResult<TMessage>>;

const global: Set<Middleware> = new Set();

const createChain = <TMessage extends Message>(
  messageType: Message['type'],
  handler: MessageHandler<TMessage>,
): MessageHandler<TMessage> => {
  const middlewares = Array.from(global);

  const chain = (): MessageHandler<TMessage> => {
    const middlewareToExecute = middlewares.shift() as
      | Middleware<TMessage>
      | undefined;

    if (!middlewareToExecute) {
      return handler;
    }

    return async (data: TMessage['data']): Promise<MessageResult<TMessage>> => {
      return await middlewareToExecute(
        {
          type: messageType,
          data,
        } as TMessage,
        async () => chain()(data),
      );
    };
  };

  return chain();
};

const hasMiddlewares = <TMessage extends Message>(
  messageType: TMessage['type'],
  handler: MessageHandler<TMessage>,
) => {
  return !!global.size;
};

const add = (options: AddOption) => {
  for (const middleware of options.middlewares) {
    global.add(middleware);
  }
};

const apply = <TMessage extends Message>(
  messageType: TMessage['type'],
  handler: MessageHandler<TMessage>,
) => {
  if (!hasMiddlewares(messageType, handler)) {
    return handler;
  }

  const handlerWithMiddlewareChain = createChain(messageType, handler);
  return handlerWithMiddlewareChain;
};

const clear = () => {
  global.clear();
};

export const middlewares = {
  add,
  apply,
  clear,
};
