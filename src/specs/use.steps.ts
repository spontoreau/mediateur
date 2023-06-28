import { Then, When } from '@cucumber/cucumber';
import { MediateurWorld } from './mediateur.world';
import { SinonSpy, fake } from 'sinon';
import { mediator } from '../core/mediator';
import { Middleware } from '../core/middlewares';

When(
  'some message global handler middlewares',
  async function (this: MediateurWorld) {
    const middleware1: Middleware = async (event, next) => {
      await next();
    };
    const middleware2: Middleware = async (event, next) => {
      await next();
    };
    const middleware3: Middleware = async (event, next) => {
      await next();
    };

    const fake1 = fake(middleware1);
    const fake2 = fake(middleware2);
    const fake3 = fake(middleware3);

    this.globalMiddlewares.push(fake1, fake2, fake3);

    mediator.use({
      middlewares: [fake1, fake2, fake3],
    });
  },
);

Then(
  'message handler global middlewares are executed',
  function (this: MediateurWorld) {
    for (const middleware of this.globalMiddlewares) {
      (middleware as SinonSpy).calledOnce.should.be.true;
    }
  },
);

When(
  'some message handler middlewares dedicated to a message type',
  async function (this: MediateurWorld) {
    const middleware1: Middleware = async (event, next) => {
      await next();
    };
    const middleware2: Middleware = async (event, next) => {
      await next();
    };
    const middleware3: Middleware = async (event, next) => {
      await next();
    };

    const fake1 = fake(middleware1);
    const fake2 = fake(middleware2);
    const fake3 = fake(middleware3);

    this.messageMiddlewares.push(fake1, fake2, fake3);
    mediator.use({
      messageType: this.message.type,
      middlewares: [fake1, fake2, fake3],
    });
  },
);

Then(
  'message handler middlewares dedicated to the message type are executed',
  function (this: MediateurWorld) {
    for (const middleware of this.messageMiddlewares) {
      (middleware as SinonSpy).calledOnce.should.be.true;
    }
  },
);
