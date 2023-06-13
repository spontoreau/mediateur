import { Then, When } from '@cucumber/cucumber';
import { SinonSpy } from 'sinon';
import { MediateurWorld } from './mediateur.world';
import { mediator } from '../core/mediator';
import { UnknownMessageError } from '../core/unknownMessage.error';

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
  'the message is handled by each handlers',
  function (this: MediateurWorld) {
    for (const handler of this.handlers) {
      (handler as SinonSpy).calledOnce.should.be.true;
    }
  },
);
