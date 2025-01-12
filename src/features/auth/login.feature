Feature: Login Test Suite

  @login @positive
  Scenario: User should login with valid credentials
    Given on app launch: Login SCN001
    When the user enters their email and passcode
    Then the user should be logged in

  @login @negative
  Scenario: User should not login in with invalid credentials
    Given on app launch: Login SCN002
    When the user enters invalid credentials
    Then the user should see an error message

  @login @negative
  Scenario: User should login with valid credentials after a failed attempt
    Given on app launch:: Login SCN003
    When the user enters their valid credentials afer a failed login attempt
    Then the user should be logged in

  @login @negative
  Scenario: User account should be locked after 3 login attempt trails
    Given on app launch: Login SCN004
    And enters invalid credentials for three times in a row
    Then the user account should be locked

  @login @negative
  Scenario: Login attempt with non-existing account credentials
    Given on app launch:: Login SCN005
    When the user enters non existent credentials
    Then the user should see the error message
