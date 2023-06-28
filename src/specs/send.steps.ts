import { Then, When } from '@cucumber/cucumber';
import { SinonSpy } from 'sinon';
import { MediateurWorld } from './mediateur.world';
import { mediator } from '../core/mediator';
import { SendToMultipleHandlersError } from '../core/errors/multipleHandlersMessage.error';
import { UnknownMessageError } from '../core/errors/unknownMessage.error';

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

Then('the message is handled', function (this: MediateurWorld) {
  const fake = this.handler as SinonSpy;
  fake.calledOnce.should.be.true;
});
