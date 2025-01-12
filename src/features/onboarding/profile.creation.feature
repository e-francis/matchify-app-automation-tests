Feature: Onboarding Test Suite

  @onboarding @positive
  Scenario: User should create a profile sucessfully
    Given the user is on the welcome screen: Onboarding SCN001
    And the user navigates to the sign up screen
    When the user fills the onboarding form
    Then the user account should be created successfully

  @onboarding @negative
  Scenario: User should not select more than five interests
    Given the user is on the welcome screen: Onboarding SCN002
    And the user navigates to the sign up screen
    When the user attempts to select more than 5 interests
    Then the user should see an error message

  @onboarding @negative
  Scenario: User should not upload an image exceeding 1MB
    Given the user is on the welcome screen: Onboarding SCN003
    And the user navigates to the sign up screen
    When the user attempts to upload an image exceeding the allowed maximum size
    Then the user should see an error message

  @onboarding @negative
  Scenario: User should not upload an invalid image format
    Given the user is on the welcome screen: Onboarding SCN004
    And the user navigates to the sign up screen
    When the user attempts to upload an invalid image
    Then the user should see an error message

  @onboarding @negative
  Scenario: User should create a profile with existing credentials
    Given the user is on the welcome screen: Onboarding SCN005
    And the user navigates to the sign up screen
    When the user attempts to create a profile with an already existing credential
    Then the user should see an error message
