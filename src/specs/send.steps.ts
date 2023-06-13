import { Then, When } from '@cucumber/cucumber';
import { SinonSpy } from 'sinon';
import { MediateurWorld } from './mediateur.world';
import { mediator } from '../core/mediator';
import { UnknownMessageError } from '../core/unknownMessage.error';
import { SendToMultipleHandlersError } from '../core/multipleHandlersMessage.error';

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
