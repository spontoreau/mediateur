Feature: Use a global middleware

  Rule: A global middleware can be registred for all messages

    As a developer
    I want to use a global middleware
    So I can automatically execute another behavior when handling a message

    Scenario: Some message handler middlewares can be added globally
      Given a message
      And a message handler
      And some message global handler middlewares
      When sending the message
      Then the message is handled
      And message handler global middlewares are executed

    Scenario: Some message handler middlewares can be added for a message type
      Given a message
      And a message handler
      And some message handler middlewares dedicated to a message type
      When sending the message
      Then the message is handled
      And message handler middlewares dedicated to the message type are executed

    Scenario: Some message handler middlewares can be added for a handler
      Given a message
      And a message handler
      And some message handler middlewares dedicated to a handler
      When sending the message
      Then the message is handled
      And message handler middlewares dedicated to the handler are executed
