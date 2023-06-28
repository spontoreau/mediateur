import { Message } from './message';
import { MessageHandler } from './messageHandler';
import { MessageResult } from './messageResult';
import { Middleware, middlewares } from './middlewares';
import { SendToMultipleHandlersError } from './multipleHandlersMessage.error';
import { UnknownMessageError } from './unknownMessage.error';

const registry = new Map<string, Array<MessageHandler>>();

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

  return handlers.map((h) => middlewares.apply(messageType, h));
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

const use = (...globalMiddlewares: ReadonlyArray<Middleware>) => {
  middlewares.add({
    middlewares: globalMiddlewares,
  });
};

const mediator = {
  register,
  send,
  publish,
  use,
} as const;

const clear = () => {
  registry.clear();
  middlewares.clear();
};

export { mediator, clear };
