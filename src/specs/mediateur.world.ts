import { World } from '@cucumber/cucumber';
import { Message } from '../core/message';
import { MessageHandler } from '../core/messageHandler';
import { MessageHandlerMiddleware } from '../core/messageHandlerMiddleware';

export class MediateurWorld extends World {
  #messageType!: string;

  get messageType() {
    if (!this.#messageType) {
      throw new Error('MessageType is not initialized');
    }
    return this.#messageType;
  }

  set messageType(value: string) {
    this.#messageType = value;
  }

  #message!: Message;

  get message() {
    if (!this.#message) {
      throw new Error('Message is not initialized');
    }
    return this.#message;
  }

  set message(value: Message) {
    this.#message = value;
  }

  #handler!: MessageHandler;

  get handler() {
    if (!this.#handler) {
      throw new Error('Handler is not initialized');
    }
    return this.#handler;
  }

  set handler(value: MessageHandler) {
    this.#handler = value;
  }

  accessor handlers: Array<MessageHandler> = [];

  accessor globalMiddlewares: Array<MessageHandlerMiddleware> = [];

  #error!: Error;

  get error() {
    if (!this.#error) {
      throw new Error('Error is not initialized');
    }
    return this.#error;
  }

  set error(value: Error) {
    this.#error = value;
  }
}
