import { Given, When, Then } from "@wdio/cucumber-framework";
import { container } from "tsyringe";
import App from "../../screens/app";

const app = container.resolve(App);

Given(/^on app launch: Login SCN00(\d+)$/, async (scenario: string) => {
  await app.welcomeScreen.onAppLaunchLogin();

  console.log(`Executing Login scenario ${scenario}`);
});

When(/^the user enters their email and passcode$/, async () => {
  await app.login.loginWithValidCredentials();
});

When(/^the user enters invalid credentials$/, async () => {
  await app.login.loginWithInvalidCredentials();
});

When(
  /^the user enters their valid credentials afer a failed login attempt$/,
  async () => {
    await app.login.loginWithValidCredentials();
    await app.login.loginWithValidCredentials();
  }
);

When(/^the user enters non existent credentials$/, async () => {
  await app.login.loginWithNonExsistentAccount();
});

Given(/^enters invalid credentials for three times in a row$/, async () => {
  await app.login.loginWithInvalidCredentialsThreeTimesInArow();
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
