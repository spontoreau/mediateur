import { afterEach, describe, it } from 'node:test';
import { SinonSpy, fake } from 'sinon';
import { Message } from './message';
import { MessageHandler } from './messageHandler';
import { clear, mediator } from './mediator';
import { UnknownMessageError } from './errors/unknownMessage.error';
import { MultipleHandlersError } from './errors/multipleHandlers.error';
import { expect, should } from 'chai';
import { Middleware } from './middlewares';

should();

describe('mediator.send', () => {
  afterEach(() => clear());

  it('should handle the message when sending it through the mediator', async () => {
    // Arrange
    const type = 'CREATE_PERSON';
    type CreatePersonMessageType = typeof type;
    type CreatePersonMessage = Message<
      CreatePersonMessageType,
      {
        firstName: string;
        lastName: string;
        email: string;
        age: number;
      }
    >;

    const handler: MessageHandler<CreatePersonMessage> = fake();
    mediator.register(type, handler);

    // Act
    const message: CreatePersonMessage = {
      type,
      data: {
        firstName: 'Anthony',
        lastName: 'Houston',
        email: 'anthony.houston@some-email.com',
        age: 30,
      },
    };

    await mediator.send<CreatePersonMessage>(message);

    const expected = {
      ...message.data,
    };

    // Assert
    (handler as SinonSpy).calledOnce.should.be.true;
    (handler as SinonSpy).calledOnceWith([expected]);
  });

  it('should return registered message types when getting message types from mediator', async () => {
    // Arrange
    const type1 = 'TYPE_1';
    const type2 = 'TYPE_2';
    const type3 = 'TYPE_3';
    mediator.register(type3, async () => {});
    mediator.register(type2, async () => {});
    mediator.register(type1, async () => {});

    // Act
    const actual = mediator.getMessageTypes();

    const expected = [type1, type2, type3];

    // Assert
    actual.should.be.deep.equal(expected);
  });

  it('should return registered metadata when getting metadata from mediator', async () => {
    // Arrange
    const type1 = 'TYPE_1';
    const type2 = 'TYPE_2';
    mediator.register(type2, async () => {}, { meta1Prop: 'meta1value' });
    mediator.register(type2, async () => {}, { meta2Prop: 'meta2value' });
    mediator.register(type1, async () => {}, { meta3Prop: 'meta3value' });

    // Act
    const actualMessageMetadata = mediator.getMetadata(type2);

    const expectedMessageMetadata = {
      meta1Prop: 'meta1value',
      meta2Prop: 'meta2value',
    };

    // Assert
    expect(actualMessageMetadata).to.be.deep.equal(expectedMessageMetadata);

    const actualAllMetadata = mediator.getAllMetadata();

    const expectedAllMetadata = [
      {
        type: type2,
        metadata: {
          meta1Prop: 'meta1value',
          meta2Prop: 'meta2value',
        },
      },
      {
        type: type1,
        metadata: {
          meta3Prop: 'meta3value',
        },
      },
    ];

    actualAllMetadata.should.deep.equal(expectedAllMetadata);
  });

  it('should throw error when sending an unknown message through the mediator', async () => {
    // Arrange
    const type = 'CREATE_PERSON';
    type CreatePersonMessageType = typeof type;
    type CreatePersonMessage = Message<
      CreatePersonMessageType,
      {
        firstName: string;
        lastName: string;
        email: string;
        age: number;
      }
    >;

    // Act
    const message: CreatePersonMessage = {
      type,
      data: {
        firstName: 'Anthony',
        lastName: 'Houston',
        email: 'anthony.houston@some-email.com',
        age: 30,
      },
    };

    // Act
    let actual: Error = new Error('This is not the error you are looking for!');
    try {
      await mediator.send<CreatePersonMessage>(message);
    } catch (e) {
      actual = e as Error;
    }

    // Assert
    actual.should.be.instanceOf(UnknownMessageError);
    actual.message.should.be.equal(
      `The message doesn't have any corresponding handler (MESSAGE_TYPE: CREATE_PERSON)`,
    );
  });

  it('should throw error when sending a message through the mediator that can be handled with multiple handlers', async () => {
    // Arrange
    const type = 'CREATE_PERSON';
    type CreatePersonMessageType = typeof type;
    type CreatePersonMessage = Message<
      CreatePersonMessageType,
      {
        firstName: string;
        lastName: string;
        email: string;
        age: number;
      }
    >;

    mediator.register(type, () => Promise.resolve());
    mediator.register(type, () => Promise.resolve());

    // Act
    const message: CreatePersonMessage = {
      type,
      data: {
        firstName: 'Anthony',
        lastName: 'Houston',
        email: 'anthony.houston@some-email.com',
        age: 30,
      },
    };

    // Act
    let actual: Error = new Error('This is not the error you are looking for!');
    try {
      await mediator.send<CreatePersonMessage>(message);
    } catch (e) {
      actual = e as Error;
    }

    // Assert
    actual.should.be.instanceOf(MultipleHandlersError);
    actual.message.should.be.equal(
      `Multiple handlers are registred, use publish function instead (MESSAGE_TYPE: CREATE_PERSON)`,
    );
  });
});

describe('mediator.publish', () => {
  afterEach(() => clear());

  it('should handle the message with each handlers when publishing it through the mediator', async () => {
    // Arrange
    const type = 'CREATE_PERSON';
    type CreatePersonMessageType = typeof type;
    type CreatePersonMessage = Message<
      CreatePersonMessageType,
      {
        firstName: string;
        lastName: string;
        email: string;
        age: number;
      }
    >;

    const handler1: MessageHandler<CreatePersonMessage> = fake();
    mediator.register(type, handler1);

    const handler2: MessageHandler<CreatePersonMessage> = fake();
    mediator.register(type, handler2);

    // Act
    const message: CreatePersonMessage = {
      type,
      data: {
        firstName: 'Anthony',
        lastName: 'Houston',
        email: 'anthony.houston@some-email.com',
        age: 30,
      },
    };

    await mediator.publish<CreatePersonMessage>(message);

    const expected = {
      ...message.data,
    };

    // Assert
    (handler1 as SinonSpy).calledOnce.should.be.true;
    (handler1 as SinonSpy).calledOnceWith([expected]);

    (handler2 as SinonSpy).calledOnce.should.be.true;
    (handler2 as SinonSpy).calledOnceWith([expected]);
  });

  it('should throw error when publishing an unknown message through the mediator', async () => {
    // Arrange
    const type = 'CREATE_PERSON';
    type CreatePersonMessageType = typeof type;
    type CreatePersonMessage = Message<
      CreatePersonMessageType,
      {
        firstName: string;
        lastName: string;
        email: string;
        age: number;
      }
    >;

    // Act
    const message: CreatePersonMessage = {
      type,
      data: {
        firstName: 'Anthony',
        lastName: 'Houston',
        email: 'anthony.houston@some-email.com',
        age: 30,
      },
    };

    // Act
    let actual: Error = new Error('This is not the error you are looking for!');
    try {
      await mediator.publish<CreatePersonMessage>(message);
    } catch (e) {
      actual = e as Error;
    }

    // Assert
    actual.should.be.instanceOf(UnknownMessageError);
    actual.message.should.be.equal(
      `The message doesn't have any corresponding handler (MESSAGE_TYPE: CREATE_PERSON)`,
    );
  });
});

describe('mediator.use', () => {
  afterEach(() => clear());

  it('should execute global middlewares when sending it through the mediator', async () => {
    // Arrange
    const type = 'CREATE_PERSON';
    type CreatePersonMessageType = typeof type;
    type CreatePersonMessage = Message<
      CreatePersonMessageType,
      {
        firstName: string;
        lastName: string;
        email: string;
        age: number;
      }
    >;

    const handler: MessageHandler<CreatePersonMessage> = fake();

    const middlewareImplementation: Middleware = async (message, next) => {
      await next();
    };
    const middleware = fake(middlewareImplementation);

    mediator.use({
      middlewares: [middleware],
    });

    mediator.register(type, handler);

    // Act
    const message: CreatePersonMessage = {
      type,
      data: {
        firstName: 'Anthony',
        lastName: 'Houston',
        email: 'anthony.houston@some-email.com',
        age: 30,
      },
    };

    await mediator.send<CreatePersonMessage>(message);

    // Assert
    middleware.calledOnce.should.be.true;
    middleware.getCall(0).args[0].should.be.deep.equal(message);
  });

  it('should execute middlewares dedicated to a message type when sending it through the mediator', async () => {
    // Arrange
    const type = 'CREATE_PERSON';
    type CreatePersonMessageType = typeof type;
    type CreatePersonMessage = Message<
      CreatePersonMessageType,
      {
        firstName: string;
        lastName: string;
        email: string;
        age: number;
      }
    >;

    const handler: MessageHandler<CreatePersonMessage> = fake();

    const middlewareImplementation: Middleware = async (message, next) => {
      await next();
    };
    const middleware1 = fake(middlewareImplementation);
    const middleware2 = fake(middlewareImplementation);

    mediator.use({
      messageType: 'CREATE_PERSON',
      middlewares: [middleware1],
    });
    mediator.use({
      messageType: 'AN_OTHER_MESSAGE_TYPE',
      middlewares: [middleware2],
    });

    mediator.register(type, handler);

    // Act
    const message: CreatePersonMessage = {
      type,
      data: {
        firstName: 'Anthony',
        lastName: 'Houston',
        email: 'anthony.houston@some-email.com',
        age: 30,
      },
    };

    await mediator.send<CreatePersonMessage>(message);

    // Assert
    middleware1.calledOnce.should.be.true;
    middleware1.getCall(0).args[0].should.be.deep.equal(message);

    middleware2.called.should.be.false;
  });

  it('should execute a middleware dedicated to some message types when sending it through the mediator', async () => {
    // Arrange
    const createPersonMessageType = 'CREATE_PERSON';
    type CreatePersonMessageType = typeof createPersonMessageType;
    type CreatePersonMessage = Message<
      CreatePersonMessageType,
      {
        firstName: string;
        lastName: string;
        email: string;
        age: number;
      }
    >;

    const anotherMessageType = 'ANOTHER_MESSAGE_TYPE';
    type AnotherMessageType = typeof anotherMessageType;
    type AnotherMessage = Message<AnotherMessageType, {}>;

    const createPersonMessageHandler: MessageHandler<CreatePersonMessage> =
      fake();
    const anotherMessageHandler: MessageHandler<AnotherMessage> = fake();

    const middlewareImplementation: Middleware = async (message, next) => {
      await next();
    };
    const middleware: Middleware<CreatePersonMessage | AnotherMessage> = fake(
      middlewareImplementation,
    );

    mediator.use({
      messageType: ['CREATE_PERSON', 'ANOTHER_MESSAGE_TYPE'],
      middlewares: [middleware],
    });

    mediator.register(createPersonMessageType, createPersonMessageHandler);
    mediator.register(anotherMessageType, anotherMessageHandler);

    // Act
    const message1: CreatePersonMessage = {
      type: createPersonMessageType,
      data: {
        firstName: 'Anthony',
        lastName: 'Houston',
        email: 'anthony.houston@some-email.com',
        age: 30,
      },
    };

    await mediator.send<CreatePersonMessage>(message1);

    const message2 = {
      type: anotherMessageType,
      data: {},
    };

    await mediator.send(message2);

    // Assert
    (middleware as SinonSpy).callCount.should.be.equal(2);
    (middleware as SinonSpy).getCall(0).args[0].should.be.deep.equal(message1);
    (middleware as SinonSpy).getCall(1).args[0].should.be.deep.equal(message2);
  });

  it('should execute middlewares dedicated to a message handler when sending it through the mediator', async () => {
    // Arrange
    const type = 'CREATE_PERSON';
    type CreatePersonMessageType = typeof type;
    type CreatePersonMessage = Message<
      CreatePersonMessageType,
      {
        firstName: string;
        lastName: string;
        email: string;
        age: number;
      }
    >;

    const handler: MessageHandler<CreatePersonMessage> = fake();

    const middlewareImplementation: Middleware = async (message, next) => {
      await next();
    };

    const middleware = fake(middlewareImplementation);

    mediator.use({
      middlewares: [middleware],
      handler,
    });

    mediator.register(type, handler);

    // Act
    const message: CreatePersonMessage = {
      type,
      data: {
        firstName: 'Anthony',
        lastName: 'Houston',
        email: 'anthony.houston@some-email.com',
        age: 30,
      },
    };

    await mediator.send<CreatePersonMessage>(message);

    // Assert
    middleware.calledOnce.should.be.true;
    middleware.getCall(0).args[0].should.be.deep.equal(message);
  });

  it('should execute global middlewares when publishing it through the mediator', async () => {
    // Arrange
    const type = 'CREATE_PERSON';
    type CreatePersonMessageType = typeof type;
    type CreatePersonMessage = Message<
      CreatePersonMessageType,
      {
        firstName: string;
        lastName: string;
        email: string;
        age: number;
      }
    >;

    const handler1: MessageHandler<CreatePersonMessage> = fake();
    const handler2: MessageHandler<CreatePersonMessage> = fake();

    const middlewareImplementation: Middleware = async (message, next) => {
      await next();
    };
    const middleware = fake(middlewareImplementation);

    mediator.use({
      middlewares: [middleware],
    });

    mediator.register(type, handler1);
    mediator.register(type, handler2);

    // Act
    const message: CreatePersonMessage = {
      type,
      data: {
        firstName: 'Anthony',
        lastName: 'Houston',
        email: 'anthony.houston@some-email.com',
        age: 30,
      },
    };

    await mediator.publish<CreatePersonMessage>(message);

    // Assert
    middleware.callCount.should.be.equal(2);
    middleware.getCall(0).args[0].should.be.deep.equal(message);
    middleware.getCall(1).args[0].should.be.deep.equal(message);
  });

  it('should execute middlewares dedicated to a message type when publishing it through the mediator', async () => {
    // Arrange
    const type = 'CREATE_PERSON';
    type CreatePersonMessageType = typeof type;
    type CreatePersonMessage = Message<
      CreatePersonMessageType,
      {
        firstName: string;
        lastName: string;
        email: string;
        age: number;
      }
    >;

    const handler1: MessageHandler<CreatePersonMessage> = fake();
    const handler2: MessageHandler<CreatePersonMessage> = fake();

    const middlewareImplementation: Middleware = async (message, next) => {
      await next();
    };

    const middleware1 = fake(middlewareImplementation);
    const middleware2 = fake(middlewareImplementation);

    mediator.use({
      messageType: 'CREATE_PERSON',
      middlewares: [middleware1],
    });
    mediator.use({
      messageType: 'AN_OTHER_MESSAGE_TYPE',
      middlewares: [middleware2],
    });

    mediator.register(type, handler1);
    mediator.register(type, handler2);

    // Act
    const message: CreatePersonMessage = {
      type,
      data: {
        firstName: 'Anthony',
        lastName: 'Houston',
        email: 'anthony.houston@some-email.com',
        age: 30,
      },
    };

    await mediator.publish<CreatePersonMessage>(message);

    // Assert
    middleware1.callCount.should.be.equal(2);
    middleware1.getCall(0).args[0].should.be.deep.equal(message);
    middleware1.getCall(1).args[0].should.be.deep.equal(message);

    middleware2.called.should.be.false;
  });

  it('should execute middlewares dedicated to a message handler when publishing it through the mediator', async () => {
    // Arrange
    const type = 'CREATE_PERSON';
    type CreatePersonMessageType = typeof type;
    type CreatePersonMessage = Message<
      CreatePersonMessageType,
      {
        firstName: string;
        lastName: string;
        email: string;
        age: number;
      }
    >;

    const handler1: MessageHandler<CreatePersonMessage> = fake();
    const handler2: MessageHandler<CreatePersonMessage> = fake();

    const middlewareImplementation: Middleware = async (message, next) => {
      await next();
    };

    const middleware = fake(middlewareImplementation);

    mediator.use({
      middlewares: [middleware],
      handler: handler1,
    });

    mediator.register(type, handler1);
    mediator.register(type, handler2);

    // Act
    const message: CreatePersonMessage = {
      type,
      data: {
        firstName: 'Anthony',
        lastName: 'Houston',
        email: 'anthony.houston@some-email.com',
        age: 30,
      },
    };

    await mediator.publish<CreatePersonMessage>(message);

    // Assert
    middleware.calledOnce.should.be.true;
    middleware.getCall(0).args[0].should.be.deep.equal(message);
  });
});
