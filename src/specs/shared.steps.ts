import { Given, Then, When } from '@cucumber/cucumber';
import { randomUUID } from 'crypto';
import { fake } from 'sinon';
import { MediateurWorld } from './mediateur.world';
import { mediator } from '../core/mediator';

Given('a message', function (this: MediateurWorld) {
  this.messageType = randomUUID();
  this.message = {
    type: this.messageType,
    data: {},
  };
});

Given('a message handler', function (this: MediateurWorld) {
  this.handler = fake();

  mediator.register(this.messageType, this.handler);
});

Given('some registred message handlers', function (this: MediateurWorld) {
  const handler1 = fake();
  const handler2 = fake();
  this.handlers.push(handler1, handler2);

  mediator.register(this.messageType, handler1);
  mediator.register(this.messageType, handler2);
});

Then(
  'an error is raised stating that {string}',
  function (this: MediateurWorld, expected: string) {
    const actual = this.error.message;

    actual.should.be.equal(expected);
  },
);
