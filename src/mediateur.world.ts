import { World } from "@cucumber/cucumber";
import { Message } from "./core/message";
import { Handler } from "./core/messageHandler";

export class MediateurWorld extends World {
    #messageType!: symbol;

    get messageType() {
      if(!this.#messageType) {
        throw new Error('MessageType is not initialized');
      }
      return this.#messageType;
    }

    set messageType(value: symbol) {
      this.#messageType = value;
    }

    #message!: Message;

    get message() {
      if(!this.#message) {
        throw new Error('Message is not initialized');
      }
      return this.#message;
    }

    set message(value: Message) {
      this.#message = value;
    }

    #handler!:Handler;

    get handler() {
      if(!this.#handler) {
        throw new Error('Handler is not initialized');
      }
      return this.#handler;
    }

    set handler(value: Handler) {
      this.#handler = value;
    }

    #hasBeenExecuted!:boolean;

    get hasBeenExecuted() {
      if(!this.#hasBeenExecuted) {
        throw new Error('HasBeenExecuted is not initialized');
      }
      return this.#hasBeenExecuted;
    }

    set hasBeenExecuted(value: boolean) {
      this.#hasBeenExecuted = value;
    }
}