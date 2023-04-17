import { Message } from "./message";
import { Handler } from "./messageHandler";
import { MessageResult } from "./messageResult";

const registry = new Map<symbol, Handler>();

const register = <TKey extends symbol, TMessage extends Message<TKey>>(
  messageKey: TKey, messageHandler: Handler<TMessage>) => {
  registry.set(messageKey, messageHandler as Handler);
};

const getHandler = <TKey extends symbol, TMessage extends Message<TKey>>(messageKey: TKey): Handler<TMessage> => {
  return registry.get(messageKey) as Handler<TMessage>;
}

const mediator = {
  register,
  getHandler
};

export { mediator };