import { setWorldConstructor, Before } from '@cucumber/cucumber';
import { MediateurWorld } from './mediateur.world';
import { should } from 'chai';
import { clear } from './core/mediator';

should();
setWorldConstructor(MediateurWorld);

Before(() => {
  clear();
});
