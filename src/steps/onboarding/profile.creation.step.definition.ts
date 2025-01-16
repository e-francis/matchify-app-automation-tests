import { Given, When, Then } from "@wdio/cucumber-framework";
import { container } from "tsyringe";
import App from "../../screens/app.ts";
import { generateOnboardingData } from "../../utils/helpers/user.data.ts";
import { authData } from "../../test-data/modules/auth.data.ts";

const app = container.resolve(App);

const { userData } = generateOnboardingData();
const passcode = parseInt(userData.pin);

Given(/^on app launch: Onboarding SCN00(\d+)$/, async (scenario: string) => {
  await app.welcomeScreen.onAppLaunchOnboarding();

  console.log(`Executing Onboarding scenario ${scenario}`);
});

When(/^the user fills the onboarding form$/, async () => {
  await app.profileCreation.fillFirstOnboardingForm(
    userData.firstname,
    userData.lastname,
    userData.email
  );
  await app.profileCreation.fillSecondOnboardingForm(passcode, passcode);
});

When(/^the user attempts to select more than 5 interests$/, async () => {
  await app.profileCreation.fillFirstOnboardingForm(
    userData.firstname,
    userData.lastname,
    userData.email
  );
  await app.profileCreation.selectRandomInterests.selectSixInterests();
});

When(
  /^the user attempts to create a profile while being under 18 years old$/,
  async () => {
    await app.profileCreation.fillUnderAgeProfile(
      userData.firstname,
      userData.lastname,
      userData.email
    );
  }
);

When(/^the user attempts to upload an invalid image$/, async () => {
  await app.profileCreation.fillFirstOnboardingForm(
    userData.firstname,
    userData.lastname,
    userData.email
  );
});

When(
  /^the user attempts to upload an image exceeding the maximum allowed size$/,
  async () => {
    await app.profileCreation.fillFirstOnboardingForm(
      userData.firstname,
      userData.lastname,
      userData.email
    );
  }
);

When(
  /^the user attempts to create a profile with an already existing credential$/,
  async () => {
    await app.profileCreation.fillFirstOnboardingForm(
      userData.firstname,
      userData.lastname,
      authData.login.validCredentials.email
    );
    await app.profileCreation.fillSecondOnboardingForm(passcode, passcode);
  }
);


Then(/^the user account should be created successfully$/, async () => {
  await app.profileCreation.verifySuccessfulProfileCreation();
});

Then(
  /^the user should see an the maximum interests error message$/,
  async () => {
    try {
      await app.profileCreation.verifyMaximumInterestsErrorDialog();
    } catch (error) {
      console.error("Error in Then step:", error);
      throw error;
    }
  }
);

Then(/^the user should see the minimum age error message$/, async () => {
  try {
    await app.profileCreation.verifyUnderAgeProfileError();
  } catch (error) {
    console.error("Error in Then step:", error);
    throw error;
  }
});

Then(/^the user should see the invalid image error message$/, async () => {
  try {
    await app.profileCreation.verifyInvalidImageErrorDialog();
  } catch (error) {
    console.error("Error in Then step:", error);
    throw error;
  }
});

Then(
  /^the user should see the already existing account error message$/,
  async () => {
    try {
      await app.profileCreation.verifyExistingCredentialErrorMessage();
    } catch (error) {
      console.error("Error in Then step:", error);
      throw error;
    }
  }
);

Then(/^the user should see upload error message$/, async () => {
  try {
    await app.profileCreation.verifyLargeImageErrorDialog();
  } catch (error) {
    console.error("Error in Then step:", error);
    throw error;
  }
});
