import { Given, Then, When } from "@cucumber/cucumber";
import { MediateurWorld } from "../mediateur.world";
import { getHandler, mediator } from "./mediator";
import { UnknownMessageError } from "./unknownMessage.error";

Given('a message', function (this: MediateurWorld) {
  this.messageType = Symbol('MESSAGE_TYPE');
  this.message = {
    type: this.messageType,
    data: {}
  };
});

Given('a message handler', function (this: MediateurWorld) {
  this.handler = async (message) => {
    return Promise.resolve();
  }
});

Given('a registred message handler', function (this: MediateurWorld) {
  this.handler = async (message) => {
    this.hasBeenExecuted = true;
    return Promise.resolve();
  }

  mediator.register(this.messageType, this.handler);
});

When('registring the message handler for this message', function (this: MediateurWorld) {
  mediator.register(this.messageType, this.handler);
});

When('sending the message', async function (this: MediateurWorld) {
  try {
    await mediator.send(this.message);
  } catch(error) {
    if(error instanceof UnknownMessageError) {

      this.error = error as Error;
    }
  }
});

Then('the message handler is available in the handler registry', function (this: MediateurWorld) {
  const actual = getHandler(this.messageType);

  actual.should.be.equal(this.handler);
});

Then('the message is handled', function (this: MediateurWorld) {
  const actual = this.hasBeenExecuted;

  actual.should.be.equal(true);
});

Then('an error is raised stating that {string}', function (this: MediateurWorld, expected: string) {
  const actual = this.error.message;

  actual.should.be.equal(expected);
});