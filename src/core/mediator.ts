import { Message } from "./message";
import { Handler } from "./messageHandler";
import { MessageResult } from "./messageResult";
import { UnknownMessageError } from "./unknownMessage.error";

const registry = new Map<symbol, Handler>();

const register = <TKey extends symbol, TMessage extends Message<TKey>>(
  messageKey: TKey, messageHandler: Handler<TMessage>) => {
  registry.set(messageKey, messageHandler as Handler);
};

const getHandler = <TKey extends symbol, TMessage extends Message<TKey>>(messageKey: TKey): Handler<TMessage> => {
  if(!registry.has(messageKey)) {
    throw new UnknownMessageError();
  }
  return registry.get(messageKey) as Handler<TMessage>;
}

const send = async <TMessage extends Message>({ type, data }: TMessage): Promise<MessageResult<TMessage>> => {
  const handle = getHandler<typeof type, TMessage>(type);
  return handle(data);
};

const mediator = {
  register,
  send,
  getHandler
};

export { mediator };