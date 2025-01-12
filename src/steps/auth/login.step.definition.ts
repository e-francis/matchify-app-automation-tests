import { Given, When, Then } from "@wdio/cucumber-framework";
import { container } from "tsyringe";
import App from "../../screens/app.ts";
import { authData } from "../../test-data/modules/auth.data.ts";
import { loginCredentials } from "../../utils/api/api.service.utils.ts";

const app = container.resolve(App);

Given(/^on app launch: Login SCN00(\d+)$/, async (scenario: string) => {
  await app.welcomeScreen.onAppLaunchLogin();

  console.log(`Executing Login scenario ${scenario}`);
});

When(/^the user enters their email and passcode$/, async () => {
  await app.login.loginWithValidCredentials(
    authData.login.validCredentials.email,
    authData.login.validCredentials.passcode
  );
});

When(/^the user enters invalid credentials$/, async () => {
  await app.login.loginWithInvalidCredentials(
    authData.login.invalidCredentials.email,
    authData.login.invalidCredentials.passcode
  );
});

When(
  /^the user enters their valid credentials afer a failed login attempt$/,
  async () => {
    if (!loginCredentials) {
      throw new Error(
        "Login credentials not available - profile creation might have failed"
      );
    }

    const { email, passcode } = loginCredentials;
    const invalidPasscode = authData.login.invalidCredentials.passcode;

    try {
      await app.login.loginWithValidCredentialsAfterInvalidCredentials(
        email,
        invalidPasscode,
        passcode
      );
    } catch (error) {
      if (error) {
        console.error("Login failed:", error);
      } else {
        console.error("An unexpected error occurred during login");
      }
      throw error;
    }
  }
);

When(/^the user enters non existent credentials$/, async () => {
  await app.login.loginWithNonExistentAccount(
    authData.login.notExistingCredentials.email,
    authData.login.notExistingCredentials.passcode
  );
});

Given(/^enters invalid credentials for three times in a row$/, async () => {
  if (!loginCredentials) {
    throw new Error(
      "Login credentials not available - profile creation might have failed"
    );
  }

  const { email } = loginCredentials;
  const invalidPasscode = authData.login.invalidCredentials.passcode;
  await app.login.loginWithInvalidCredentialsThreeTimesInArow(
    email,
    invalidPasscode
  );
});

Then(/^the user should be logged in$/, async () => {
  await app.login.verifySuccessfuLogin();
});

Then(/^the user should see an error message$/, async () => {
  await app.login.verifyInvalidPasscodeErrorMessage();
});

Then(/^the user account should be locked$/, async () => {
  await app.login.verifyLockedAccountMessage();
});

Then(/^the user should see the error message$/, async () => {
  await app.login.verifyNonExistentAccountErrorMessage();
});
