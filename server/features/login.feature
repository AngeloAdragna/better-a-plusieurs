Feature: User Authentication


  Scenario: Failed login via UI
    Given a user "test-arthur" with password "1234"
    And I am on the home page
    When I click on the login button
    When I fill in username "wrong-user" and password "wrong"
    Then I should see an error message when i submit
