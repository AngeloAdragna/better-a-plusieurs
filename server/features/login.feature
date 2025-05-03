Feature: User Authentication

 
  Scenario: Successful login via UI
    Given a user "test-arthur" with password "1234"
    And I am on the home page
    When I click on the login button
    When I fill in username "test-arthur" and password "1234"
    And I click the submit button
    When I click on the create room button
    When I fill in the room name with "test-room"
    And I check all the checkboxes
    And I click the submit button
    And I fill in the searchbar with "crazy frog"
    And I click the searchbar button
    And I click on the button number 1 to add video to the playlist
    And I click on the button number 3 to add video to the playlist
    And I select the video number 2
    And I display the playlist
    And I wait for 2 seconds
    And I launch the video
    And I wait for 5 seconds
    And I display the history
    And I wait for 2 seconds
    And I display the playlist
    And I click on the skip button
    And I wait for 5 seconds
