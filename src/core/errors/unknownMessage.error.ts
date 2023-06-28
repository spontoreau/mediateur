export class UnknownMessageError extends Error {
  constructor() {
    super(`The message doesn't have any corresponding handler`);
  }
}
