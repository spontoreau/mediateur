export class MultipleHandlersError extends Error {
  constructor(messageType: string) {
    super(
      `Multiple handlers are registred, use publish function instead (MESSAGE_TYPE: ${messageType})`,
    );
  }
}
