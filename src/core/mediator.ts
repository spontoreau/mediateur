import { Message } from './message';
import { MessageHandler } from './messageHandler';
import { MessageResult } from './messageResult';
import { UnknownMessageError } from './unknownMessage.error';

const registry = new Map<string, MessageHandler>();

const register = <TKey extends string, TMessage extends Message<TKey>>(
  messageType: TKey,
  messageHandler: MessageHandler<TMessage>,
) => {
  registry.set(messageType, messageHandler as MessageHandler);
};

export const getHandler = <TKey extends string, TMessage extends Message<TKey>>(
  messageType: TKey,
): MessageHandler<TMessage> => {
  if (!registry.has(messageType)) {
    throw new UnknownMessageError();
  }
  return registry.get(messageType) as MessageHandler<TMessage>;
};

const send = async <TMessage extends Message>({
  type,
  data,
}: TMessage): Promise<MessageResult<TMessage>> => {
  const handle = getHandler<typeof type, TMessage>(type);
  return handle(data);
};

const mediator = {
  register,
  send,
};

export { mediator };
