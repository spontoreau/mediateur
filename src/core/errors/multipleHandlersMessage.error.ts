export class SendToMultipleHandlersError extends Error {
  constructor() {
    super(
      `Multiple handlers are registred for the message, use publish function instead.`,
    );
  }
}
