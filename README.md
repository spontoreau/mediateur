[![GitHub license](https://img.shields.io/github/license/spontoreau/mediateur)](LICENCE)
[![Continuous Integration](https://github.com/spontoreau/mediateur/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/spontoreau/mediateur/actions/workflows/ci.yml)
[![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg)](https://gitmoji.dev)

# mediateur

Easy-to-use library for implementing the mediator pattern

## Getting started
Start by installing the **mediateur** library in your project with the following NPM command:
```bash
npm i mediateur
```

Then define a **Message**:

```typescript
// createPerson.ts
import type { Message } from 'mediateur';

export type CreatePerson = Message<'CREATE_PERSON', {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
}>
```

When your message is defined, you can create a dedicated async function to handle it using the **MessageHandler** type:

```typescript
// createPerson.handler.ts
import type { MessageHandler } from 'mediateur';
import type { CreatePerson } from './createPerson.ts'

const createPersonHandler: MessageHandler<CreatePerson> = async (message) => {
  console.table(message);
  return Promise.resolve();
}
```

Finally, add the handler to the meditor with the **register** function, then execute the **send** function by using an instance corresponding to your message:

```typescript
// app.ts
import { mediator } from 'mediateur';
import { CreatePerson } from './createPerson';
import { createPersonHandler } from 'createPerson.handler';

mediator.register('CREATE_PERSON', createPersonHandler);

(async () => {
  const message: CreatePerson = {
    type: 'CREATE_PERSON',
    data: {
      firstName: 'Anthony',
      lastName: 'Houston',
      email: 'anthony.houston@some-email.com',
      age: 30
    }
  }
  
  await mediator.send<CreatePerson>(message);
})();
```

This example is really basic, there is more to discover in the [documentation](https://github.com/spontoreau/mediateur/wiki/documentation).

## Contributing

Before you contribute, please take a few minutes to read the
[contribution guidelines](https://github.com/spontoreau/mediateur/wiki/Contribution-guidelines).

## Code of Conduct

This project has adopted the [code of conduct](https://github.com/spontoreau/mediateur/wiki/Code-of-conduct) defined by
the Contributor Covenant.