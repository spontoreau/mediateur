import { Message } from './message';
import { MessageHandler } from './messageHandler';
import { MessageHandlerMiddleware } from './messageHandlerMiddleware';
import { MessageResult } from './messageResult';
import { SendToMultipleHandlersError } from './multipleHandlersMessage.error';
import { UnknownMessageError } from './unknownMessage.error';

let registry = new Map<string, Array<MessageHandler>>();
const globalMiddlewares: Array<MessageHandlerMiddleware> = [];
const handlerCache = new Map<string, MessageHandler>();

const register = <TKey extends string, TMessage extends Message<TKey>>(
  messageType: TKey,
  messageHandler: MessageHandler<TMessage>,
) => {
  const handlers = registry.get(messageType) ?? [];
  registry.set(messageType, [...handlers, messageHandler as MessageHandler]);
};

const getHandlers = <TKey extends string, TMessage extends Message<TKey>>(
  messageType: TKey,
): Array<MessageHandler<TMessage>> => {
  if (!registry.has(messageType)) {
    throw new UnknownMessageError();
  }

  const handlers = registry.get(messageType) as Array<MessageHandler<TMessage>>;

  if (!globalMiddlewares.length) return handlers;

  return handlers.map((handler) => {
    const wasCached = handlerCache.has(messageType);

    if (wasCached) {
      return handlerCache.get(messageType) as MessageHandler<TMessage>;
    }

    const handlerWithMiddlewareChain =
      createMessageHandlerMiddlewareChain<TMessage>(
        messageType,
        handler,
        globalMiddlewares,
      );
    handlerCache.set(messageType, handlerWithMiddlewareChain as MessageHandler);
    return handlerWithMiddlewareChain;
  });
};

const createMessageHandlerMiddlewareChain = <TMessage extends Message>(
  messageType: Message['type'],
  handler: MessageHandler<TMessage>,
  middlewares: ReadonlyArray<MessageHandlerMiddleware>,
): MessageHandler<TMessage> => {
  const middlewaresCopy = Array.from(middlewares);

  const chain = (): MessageHandler<TMessage> => {
    const middlewareToExecute = middlewaresCopy.shift() as
      | MessageHandlerMiddleware<TMessage>
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

const send = async <TMessage extends Message>({
  type,
  data,
}: TMessage): Promise<MessageResult<TMessage>> => {
  const handlers = getHandlers<typeof type, TMessage>(type);

  if (handlers.length > 1) {
    throw new SendToMultipleHandlersError();
  }

  return handlers[0](data);
};

const publish = async <TMessage extends Message>({ type, data }: TMessage) => {
  const handlers = getHandlers<typeof type, TMessage>(type);

  await Promise.all(handlers.map((handler) => handler(data)));
};

const use = (...middlewares: ReadonlyArray<MessageHandlerMiddleware>) => {
  globalMiddlewares.push(...middlewares);
};

const mediator = {
  register,
  send,
  publish,
  use,
} as const;

const clear = () => {
  registry = new Map();
};

export { mediator, clear };
