export class UnknownMessageError extends Error {
  constructor(messageType: string) {
    super(
      `The message doesn't have any corresponding handler (MESSAGE_TYPE: ${messageType})`,
    );
  }
}
