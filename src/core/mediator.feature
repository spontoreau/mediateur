Feature: Send a message

  As a developer
  I want to send a message
  So I can use a behavior of my software by executing it with a handler that corresponds to this message

  Rule: A message handler can be registered in the mediator

    Scenario: A message handler can be registered in the mediator
      Given a message
      And a message handler
      When registring the message handler for this message
      Then the message handler is available in the handler registry

  Rule: A message can be sent and handled to execute a behavior of my software

    Scenario: A message can be sent and handled to execute a behavior of my software
      Given a message
      And a registred message handler
      When sending the message
      Then the message is handled

    Scenario: An unknown message has been sent
      Given a message
      When sending the message
      Then an error is raised stating that "The message doesn't have any corresponding handler"

    Scenario: A message can not be sent and handled by multiple handlers
      Given a message
      And some registred message handlers
      When sending the message
      Then an error is raised stating that "Multiple handlers are registred for the message, use publish function instead."

  Rule: A message can be published and handled to execute multiple behaviors of my software

    Scenario: A message can be published and handled to execute multiple behaviors of my software
      Given a message
      And some registred message handlers
      When publishing the message
      Then the message is handled by each handlers