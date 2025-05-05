Feature: User Authentication

# --- TESTS API ---
  Scenario: Successful login with valid credentials
    Given a user "test-arthur" with password "1234"
    When I POST to "/login" with:
      | username | test-arthur |
      | password | 1234        |
    Then the response status should be 200
    And the response should contain "success": true
    And the response should contain a token

  Scenario: Failed login with incorrect password
    Given a user "test-arthur" with password "123456"
    When I POST to "/login" with:
      | username | test-arthur |
      | password | wrong       |
    Then the response status should be 401
    And the response should contain "success": false

  # --- TESTS UI ---
  Scenario: Successful login via UI
    Given a user "test-arthur" with password "1234"
    And I am on the home page
    When I click on the login button
    When I fill in username "test-arthur" and password "1234"
    And I click the submit button
    Then I should see the user "test-arthur" connected

  Scenario: Failed login via UI
    Given a user "test-arthur" with password "1234"
    And I am on the home page
    When I click on the login button
    When I fill in username "wrong-user" and password "wrong"
    Then I should see an error message when i submit

 
Scenario: Successful login via UI
    Given a user "test-arthur" with password "1234"
    And I am on the home page
    When I click on the login button
    When I fill in username "test-arthur" and password "1234"
    And I click the submit button
    Then I should see the user "test-arthur" connected
    When I click on the create room button
    When I fill in the room name with "test-room"
    And I check the last checkbox
    And I click the submit button
    When I fill in the searchbar with "crazy frog"
    And I click the searchbar button
    When I click on the button number 1 to add video to the playlist
    When I click on the button number 3 to add video to the playlist
    When I select the video number 2
    When I launch the video
    Then I should see the video playing
    When I display the playlist
    Then I should see the playlist displayed
    When I wait for 2 seconds
    When I display the history
    Then I should see the history displayed
    When I wait for 2 seconds
    When I display the playlist
    Then I should see the playlist displayed
    When I click on the skip button
    Then I should see the video skipped
    When I launch the video
    Then I should see the video playing
    When I wait for 3 seconds
    When I display the history
    When I wait for 3 seconds
  