import { Then, When } from '@cucumber/cucumber';
import { MediateurWorld } from './mediateur.world';
import { SinonSpy, fake } from 'sinon';
import { mediator } from '../core/mediator';
import { MessageHandlerMiddleware } from '../core/messageHandlerMiddleware';

When('some message handler middlewares', async function (this: MediateurWorld) {
  const middleware1: MessageHandlerMiddleware = async (event, next) => {
    await next();
  };
  const middleware2: MessageHandlerMiddleware = async (event, next) => {
    await next();
  };
  const middleware3: MessageHandlerMiddleware = async (event, next) => {
    await next();
  };

  const fake1 = fake(middleware1);
  const fake2 = fake(middleware2);
  const fake3 = fake(middleware3);

  this.globalMiddlewares.push(fake1, fake2, fake3);

  mediator.use(fake1, fake2, fake3);
});

Then(
  'message handler middlewares are executed',
  function (this: MediateurWorld) {
    for (const middleware of this.globalMiddlewares) {
      (middleware as SinonSpy).calledOnce.should.be.true;
    }
  },
);
