import type { Message } from "./message";
import type { MessageHandler } from "./messageHandler";
import type { MessageResult } from "./messageResult";
import { MultipleHandlersError } from "./errors/multipleHandlers.error";
import { UnknownMessageError } from "./errors/unknownMessage.error";
import { type AddOptions, middlewares } from "./middlewares";
import type { Metadata } from "./metadata";

const registry = new Map<string, Array<MessageHandler>>();
const metadatas = new Map<string, Metadata>();

const register = <TKey extends string, TMessage extends Message<TKey>>(
	messageType: TKey,
	messageHandler: MessageHandler<TMessage>,
	metadata: Metadata = {},
) => {
	const handlers = registry.get(messageType) ?? [];
	registry.set(messageType, [...handlers, messageHandler as MessageHandler]);
	const meta = metadatas.get(messageType);
	metadatas.set(messageType, {
		...meta,
		...metadata,
	});
};

const getHandlers = <TKey extends string, TMessage extends Message<TKey>>(
	messageType: TKey,
): Array<MessageHandler<TMessage>> => {
	if (!registry.has(messageType)) {
		throw new UnknownMessageError(messageType);
	}

	const handlers = registry.get(messageType) as Array<MessageHandler<TMessage>>;
	return handlers.map((handler) => middlewares.apply(messageType, handler));
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

const getMessageTypes = () => Array.from(registry.keys()).sort();
const getMetadata = (type: string) => metadatas.get(type);
const getAllMetadata = () =>
	Array.from(metadatas.entries(), ([key, value]) => ({
		type: key,
		metadata: value,
	}));

const mediator = {
	register,
	send,
	publish,
	use,
	getMessageTypes,
	getMetadata,
	getAllMetadata,
} as const;

const clear = () => {
	registry.clear();
	metadatas.clear();
	middlewares.clear();
};

export { mediator, clear };
