import { Message } from './message';
import { MessageHandler } from './messageHandler';
import { MessageResult } from './messageResult';
import { MultipleHandlersError } from './errors/multipleHandlers.error';
import { UnknownMessageError } from './errors/unknownMessage.error';
import { AddOptions, Middleware, middlewares } from './middlewares';

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
    throw new UnknownMessageError(messageType);
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
    throw new MultipleHandlersError(type);
  }

  return handlers[0](data);
};

const publish = async <TMessage extends Message>({ type, data }: TMessage) => {
  const handlers = getHandlers<typeof type, TMessage>(type);

  await Promise.all(handlers.map((handler) => handler(data)));
};

type UseOptions<TMessage extends Message> = AddOptions<TMessage>;

const use = <TMessage extends Message>(options: UseOptions<TMessage>) => {
  middlewares.add(options);
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
