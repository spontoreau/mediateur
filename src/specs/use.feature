Feature: Use a global middleware

  Rule: A global middleware can be registred for all messages

    As a developer
    I want to use a global middleware
    So I can automatically execute another behavior when handling a message

    Scenario: Some message handler middlewares can be added globally
      Given a message
      And a message handler
      And some message handler middlewares
      When sending the message
      Then the message is handled
      And message handler middlewares are executed