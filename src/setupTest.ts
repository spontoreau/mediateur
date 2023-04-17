import { setWorldConstructor } from '@cucumber/cucumber';
import { MediateurWorld } from './mediateur.world';
import { should } from 'chai';

should();
setWorldConstructor(MediateurWorld);
