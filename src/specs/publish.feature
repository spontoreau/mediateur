Feature: Publish a message

  Rule: A message can be published and handled to execute multiple behaviors of my software

    Scenario: A message can be published and handled to execute multiple behaviors of my software
      Given a message
      And some registred message handlers
      When publishing the message
      Then the message is handled by each handlers