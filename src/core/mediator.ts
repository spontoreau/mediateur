import { Message } from './message';
import { MessageHandler } from './messageHandler';
import { MessageResult } from './messageResult';
import { SendToMultipleHandlersError } from './multipleHandlersMessage.error';
import { UnknownMessageError } from './unknownMessage.error';

let registry = new Map<string, Array<MessageHandler>>();

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
  return registry.get(messageType) as Array<MessageHandler<TMessage>>;
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

const mediator = {
  register,
  send,
  publish,
} as const;

const clear = () => {
  registry = new Map();
};

export { mediator, clear };
