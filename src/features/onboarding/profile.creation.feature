Feature: Onboarding Test Suite

  @onboarding @positive
  Scenario: User should create a profile sucessfully
    Given on app launch: Onboarding SCN001
    When the user fills the onboarding form
    Then the user account should be created successfully

  @onboarding @negative
  Scenario: User should not select more than five interests
    Given on app launch: Onboarding SCN002
    When the user attempts to select more than 5 interests
    Then the user should see an the maximum interests error message

  @onboarding @negative
  Scenario: User should not upload an image exceeding 1MB
    Given on app launch: Onboarding SCN003
    When the user attempts to upload an image exceeding the maximum allowed size
    Then the user should see upload error message

  @onboarding @negative
  Scenario: User should not upload an invalid image format
    Given on app launch: Onboarding SCN004
    When the user attempts to upload an invalid image
    Then the user should see the invalid image error message

  @onboarding @negative
  Scenario: User should not create a profile with existing credentials
    Given on app launch: Onboarding SCN005
    When the user attempts to create a profile with an already existing credential
    Then the user should see the already existing account error message

  @onboarding @negative
  Scenario: Profile creation should be restricted for users under 18
    Given on app launch: Onboarding SCN006
    When the user attempts to create a profile while being under 18 years old
    Then the user should see the minimum age error message
