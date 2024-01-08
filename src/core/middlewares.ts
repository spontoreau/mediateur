import { Message } from './message';
import { MessageHandler } from './messageHandler';
import { MessageResult } from './messageResult';

export type Middleware<TMessage extends Message = Message> = (
  message: TMessage,
  next: () => Promise<MessageResult<TMessage>>,
) => Promise<MessageResult<TMessage>>;

const globalMiddlewares: Set<Middleware> = new Set();
const messageMiddlewares: Map<string, ReadonlyArray<Middleware>> = new Map();
const handlerMiddlewares: Map<
  MessageHandler,
  ReadonlyArray<Middleware>
> = new Map();

const createChain = <TMessage extends Message>(
  messageType: Message['type'],
  handler: MessageHandler<TMessage>,
): MessageHandler<TMessage> => {
  const middlewares = [
    ...globalMiddlewares,
    ...(messageMiddlewares.get(messageType) ?? []),
    ...(handlerMiddlewares.get(handler) ?? []),
  ];

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
  const hasGlobalMiddlewares = !!globalMiddlewares.size;
  const hasMessageMiddlewares = !!(messageMiddlewares.get(messageType) || [])
    .length;
  const hasHandlerMiddlewares = !!(handlerMiddlewares.get(handler) || [])
    .length;

  return hasGlobalMiddlewares || hasMessageMiddlewares || hasHandlerMiddlewares;
};

type AddMessageMiddlewaresOptions<TMessage extends Message> = {
  messageType: TMessage['type'] | Array<TMessage['type']>;
  middlewares: ReadonlyArray<Middleware<TMessage>>;
};

type AddHandlerMiddlewaresOptions<TMessage extends Message> = {
  handler: MessageHandler<TMessage>;
  middlewares: ReadonlyArray<Middleware<TMessage>>;
};

type AddGlobalMiddlewaresOptions = {
  middlewares: ReadonlyArray<Middleware>;
};

export type AddOptions<TMessage extends Message> =
  | AddMessageMiddlewaresOptions<TMessage>
  | AddHandlerMiddlewaresOptions<TMessage>
  | AddGlobalMiddlewaresOptions;

const isAddMessageMiddlewaresOptions = <TMessage extends Message>(
  value: AddOptions<TMessage>,
): value is AddMessageMiddlewaresOptions<TMessage> => {
  return typeof (value as any).messageType === 'string';
};

const isAddHandlerMiddlewaresOptions = <TMessage extends Message>(
  value: AddOptions<TMessage>,
): value is AddHandlerMiddlewaresOptions<TMessage> => {
  return typeof (value as any).handler === 'function';
};

const add = <TMessage extends Message>(options: AddOptions<TMessage>) => {
  if (isAddMessageMiddlewaresOptions(options)) {
    const messageTypes = Array.isArray(options.messageType)
      ? options.messageType
      : [options.messageType];

    for (const messageType of messageTypes) {
      const middlewares = messageMiddlewares.get(messageType) ?? [];
      messageMiddlewares.set(messageType, [
        ...middlewares,
        ...(options.middlewares as ReadonlyArray<Middleware>),
      ]);
    }
  } else if (isAddHandlerMiddlewaresOptions(options)) {
    const middlewares = handlerMiddlewares.get(options.handler) ?? [];

    handlerMiddlewares.set(options.handler, [
      ...middlewares,
      ...(options.middlewares as ReadonlyArray<Middleware>),
    ]);
  } else {
    for (const middleware of options.middlewares) {
      globalMiddlewares.add(middleware);
    }
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
  globalMiddlewares.clear();
  messageMiddlewares.clear();
  handlerMiddlewares.clear();
};

export const middlewares = {
  add,
  apply,
  clear,
};
