import { Given, Then, When } from '@cucumber/cucumber';
import { randomUUID } from 'crypto';
import { fake, SinonSpy } from 'sinon';
import { MediateurWorld } from '../mediateur.world';
import { getHandlers, mediator } from './mediator';
import { UnknownMessageError } from './unknownMessage.error';
import { SendToMultipleHandlersError } from './multipleHandlersMessage.error';

Given('a message', function (this: MediateurWorld) {
  this.messageType = randomUUID();
  this.message = {
    type: this.messageType,
    data: {},
  };
});

Given('a message handler', function (this: MediateurWorld) {
  this.handler = async () => {
    return Promise.resolve();
  };
});

Given('a registred message handler', function (this: MediateurWorld) {
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

When(
  'registring the message handler for this message',
  function (this: MediateurWorld) {
    mediator.register(this.messageType, this.handler);
  },
);

When('sending the message', async function (this: MediateurWorld) {
  try {
    await mediator.send(this.message);
  } catch (error) {
    if (
      error instanceof UnknownMessageError ||
      error instanceof SendToMultipleHandlersError
    ) {
      this.error = error as Error;
    }
  }
});

When('publishing the message', async function (this: MediateurWorld) {
  try {
    await mediator.publish(this.message);
  } catch (error) {
    if (error instanceof UnknownMessageError) {
      this.error = error as Error;
    }
  }
});

Then(
  'the message handler is available in the handler registry',
  function (this: MediateurWorld) {
    const actual = getHandlers(this.messageType)[0];

    actual.should.be.equal(this.handler);
  },
);

Then('the message is handled', function (this: MediateurWorld) {
  const fake = this.handler as SinonSpy;
  fake.calledOnce.should.be.true;
});

Then(
  'the message is handled by each handlers',
  function (this: MediateurWorld) {
    for (const handler of this.handlers) {
      (handler as SinonSpy).calledOnce.should.be.true;
    }
  },
);

Then(
  'an error is raised stating that {string}',
  function (this: MediateurWorld, expected: string) {
    const actual = this.error.message;

    actual.should.be.equal(expected);
  },
);
