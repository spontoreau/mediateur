import { Given, Then, When } from "@cucumber/cucumber";
import { MediateurWorld } from "../mediateur.world";
import { mediator } from "./mediator";

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

When('registring the message handler for this message', function (this: MediateurWorld) {
  mediator.register(this.messageType, this.handler);
});

Then('the message handler is available in the handler registry', function (this: MediateurWorld) {
  const actual = mediator.getHandler(this.messageType);

  actual.should.be.equal(this.handler);
});