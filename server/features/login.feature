Feature: User Authentication

  Scenario: Successful login with valid credentials
    Given a user "test-arthur" with password "1234"
    When I POST to "/login" with:
      | name     | test-arthur  |
      | password | 1234    |
    Then the response status should be 200
    And the response should contain "success": true

  Scenario: Failed login with incorrect password
    Given a user "test-arthur" with password "123456"
    When I POST to "/login" with:
      | name     | test-arthur  |
      | password | wrong   |
    Then the response status should be 401
    And the response should contain "success": false