import { injectable } from "tsyringe";
import { selectors } from "../../../config/environment.ts";
import EnterPasscode from "../../utils/helpers/enter.passcode.ts";
import HandleNetworkError from "../../utils/helpers/handle.network.error.ts";
import SelectRandomGender from "../../utils/helpers/gender.selector.ts";
import SelectRandomLocation from "../../utils/helpers/location.selector.ts";
import DatePickerHelper from "../../utils/helpers/date.picker.ts";
import SelectRandomInterests from "../../utils/helpers/interests.selectors.ts";
import ImageUploadHelper from "../../utils/helpers/upload.image.ts";

@injectable()
export default class ProfileCreation {
  private readonly selectors = selectors;
  private readonly enterPasscode: EnterPasscode;
  private readonly handleNetworkError: HandleNetworkError;
  private readonly selectGender: SelectRandomGender;
  private readonly selectDob: DatePickerHelper;
  private readonly selectRandomLocation: SelectRandomLocation;
  public readonly selectRandomInterests: SelectRandomInterests;
  private readonly imageUploadHelper: ImageUploadHelper;

  constructor() {
    this.enterPasscode = new EnterPasscode();
    this.handleNetworkError = new HandleNetworkError();
    this.selectGender = new SelectRandomGender();
    this.selectDob = new DatePickerHelper();
    this.selectRandomLocation = new SelectRandomLocation();
    this.selectRandomInterests = new SelectRandomInterests();
    this.imageUploadHelper = new ImageUploadHelper();
  }
  private readonly elements = {
    firstNameInputField: () =>
      $(this.selectors.onboardingSelectors.firstNameInputField),
    lastNameInputField: () =>
      $(this.selectors.onboardingSelectors.lastNameInputField),
    emailInputField: () => $(this.selectors.commonSelectors.emailInputField),
    passcodeInputField: () =>
      $(this.selectors.commonSelectors.passcodeInputField),
    genderDropDownMenuBox: () =>
      $(this.selectors.onboardingSelectors.genderDropDownMenuBox),
    datePicker: () => $(this.selectors.onboardingSelectors.datePicker),
    backButton: () =>
      $(this.selectors.onboardingSelectors.locationDropDownMenuBox),
    uploadPhotoButton: () =>
      $(this.selectors.onboardingSelectors.uploadPhotoButton),
    confrimPasscodeInputField: () =>
      $(this.selectors.onboardingSelectors.confrimPasscodeInputField),
    createAccounButton: () =>
      $(this.selectors.commonSelectors.createAccountButton),
    message: () => $(this.selectors.commonSelectors.message),
    title: () => $(this.selectors.commonSelectors.title),
    actionButton: () => $(this.selectors.commonSelectors.actionButton),
    okayButton: () => $(this.selectors.commonSelectors.okayButton),
    nextButton: () => $(this.selectors.onboardingSelectors.nextButton),
    completeAccountSetUpText: () =>
      $(this.selectors.onboardingSelectors.completeAccountSetUpText),
    underAgeErrorNotifier: () =>
      this.selectors.datePicker.underAgeErrorNotifier,
    locationDropDownMenuBox: () =>
      $(this.selectors.onboardingSelectors.locationDropDownMenuBox),
  };

  async fillFirstOnboardingForm(
    firstName: string,
    lastName: string,
    email: string
  ) {
    try {
      await this.elements.firstNameInputField().setValue(firstName);
      await this.elements.lastNameInputField().setValue(lastName);
      await this.elements.emailInputField().setValue(email);
      await this.elements.genderDropDownMenuBox().click();
      await this.selectGender.selectRandomGender();
      await this.elements.datePicker().click();
      await this.elements.okayButton().click();
      await this.elements.nextButton().click();
      await browser.pause(3000);
    } catch (error) {
      console.error("Error in filling onboarding form:", error);
      throw error;
    }
  }

  async fillSecondOnboardingForm(passcode: number, confirmPasscode: number) {
    try {
      await this.elements.completeAccountSetUpText().waitForDisplayed({
        timeout: 60000,
        timeoutMsg: "Second onboarding screen wasn't displayed",
      });
      await expect(this.elements.completeAccountSetUpText()).toHaveText(
        "Complete Your Account Setup"
      );
      await this.elements.locationDropDownMenuBox().click();
      await this.selectRandomLocation.selectRandomLocation();
      await this.selectRandomInterests.selectFiveInterests();
      await browser.swipe({ direction: "up" });
      await browser.pause(10000);
      await this.imageUploadHelper.uploadValidProfileImage();
      await this.enterPasscode.enterPasscodes(passcode, confirmPasscode);
      await browser.pause(2000);
      await this.elements.createAccounButton().click();
    } catch (error) {
      console.error("Error in filling onboarding form:", error);
      throw error;
    }
  }

  async verifySuccessfulProfileCreation() {
    try {
      await this.elements.message().waitForDisplayed({
        timeout: 60000,
        timeoutMsg: "No success message was displayed",
      });

      const isNetworkError = await this.handleNetworkError.handleNetworkError();
      if (isNetworkError) {
        throw new Error("Network connectivity issue detected");
      }

      await expect(this.elements.title()).toHaveText("Success!");
      await expect(this.elements.message()).toHaveText(
        "Profile created successfully"
      );
      await expect(this.elements.actionButton()).toHaveText(
        "Login to your account"
      );
    } catch (error) {
      console.error("Profile Creation Failed!", error);
      throw error;
    }
  }

  async verifyMaximumInterestsErrorDialog() {
    try {
      await this.elements.message().waitForDisplayed({
        timeout: 60000,
        timeoutMsg: "Error message was not displayed",
      });
      await expect(this.elements.message()).toHaveText(
        "Maximum of 5 interests allowed"
      );
    } catch (error) {
      console.error("Failed to verify maximum interests error message", error);
      throw error;
    }
  }

  async verifyInvalidImageErrorDialog() {
    try {
      await this.elements.completeAccountSetUpText().waitForDisplayed({
        timeout: 60000,
        timeoutMsg: "Second onboarding screen wasn't displayed",
      });
      await expect(this.elements.completeAccountSetUpText()).toHaveText(
        "Complete Your Account Setup"
      );
      await this.imageUploadHelper.uploadInvalidProfileImage();
      await expect(this.elements.title()).toHaveText("Invalid Image Selected");
      await expect(this.elements.message()).toHaveText(
        "Please upload a JPEG or PNG image"
      );
    } catch (error) {
      console.error(
        "Error message not dosplayed for invalid photo upload",
        error
      );
      throw error;
    }
  }

  async verifyLargeImageErrorDialog() {
    try {
      await this.elements.completeAccountSetUpText().waitForDisplayed({
        timeout: 60000,
        timeoutMsg: "Second onboarding screen wasn't displayed",
      });
      await expect(this.elements.completeAccountSetUpText()).toHaveText(
        "Complete Your Account Setup"
      );
      await this.imageUploadHelper.uploadLargeProfileImage();
      await expect(this.elements.title()).toHaveText("Image upload failed!");
      await expect(this.elements.message()).toHaveText(
        "Maximum image size is 1MB"
      );
    } catch (error) {
      console.error(
        "Error message not dosplayed for invalid photo upload",
        error
      );
      throw error;
    }
  }

  async verifyExistingCredentialErrorMessage() {
    try {
      await expect(this.elements.title()).toHaveText("Account Creation Failed");
      await expect(this.elements.message()).toHaveText("Email already exists");
    } catch (error) {
      console.error(
        "Error message not dosplayed for existing credential",
        error
      );
      throw error;
    }
  }

  async fillUnderAgeProfile(
    firstName: string,
    lastName: string,
    email: string
  ) {
    try {
      await this.elements.firstNameInputField().setValue(firstName);
      await this.elements.lastNameInputField().setValue(lastName);
      await this.elements.emailInputField().setValue(email);
      await this.elements.genderDropDownMenuBox().click();
      await this.selectGender.selectRandomGender();
      await this.elements.datePicker().click();
      await this.selectDob.setYear();
      await this.elements.okayButton().waitForDisplayed({
        timeout: 60000,
        timeoutMsg: "Second onboarding screen wasn't displayed",
      });
      await this.elements.okayButton().click();
    } catch (error) {
      console.error("Unable to fill profile", error);
      throw error;
    }
  }

  async verifyUnderAgeProfileError() {
    try {
      console.log("underage to be verified");

      const underAgeErrorElement = await $(
        this.elements.underAgeErrorNotifier()
      );

      await expect(underAgeErrorElement).toBeExisting();
      await expect(underAgeErrorElement).toBeDisplayed();

      await expect(underAgeErrorElement).toHaveText(
        "You must be 18 years or older to create an account"
      );

      console.log("underage text verified");
    } catch (error) {
      console.error("Unable to verify error text", error);
      throw error;
    }
  }
}
