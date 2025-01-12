import { injectable } from "tsyringe";
import { selectors } from "../../../config/environment";
import EnterPasscode from "../../utils/helpers/enter.passcode";

@injectable()
export default class Login {
  private readonly selectors = selectors;
  private readonly enterPasscode: EnterPasscode;

  constructor() {
    this.enterPasscode = new EnterPasscode();
  }

  private readonly elements = {
    emailInputField: () => $(this.selectors.commonSelectors.emailInputField),
    passcodeInputField: () =>
      $(this.selectors.commonSelectors.passcodeInputField),
    message: () => $(this.selectors.commonSelectors.message),
    title: () => $(this.selectors.commonSelectors.title),
    actionButton: () => $(this.selectors.commonSelectors.actionButton),
    loginButton: () => $(this.selectors.loginSelectors.loginButton),
  };

  async loginWithValidCredentials(email: string, passcode: number) {
    try {
      await this.elements.emailInputField().setValue(email);
      await this.enterPasscode.enterPasscode(passcode);
      await this.elements.loginButton().click();
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async verifySuccessfuLogin() {
    try {
      await this.elements.message().waitForDisplayed({
        timeout: 60000,
        timeoutMsg: "No success message was displayed",
      });

      await expect(this.elements.title()).toHaveText("Success");
      await expect(this.elements.message()).toHaveText("Login successful");
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async loginWithInvalidCredentials(email: string, invalidPasscode: number) {
    try {
      await this.elements.emailInputField().setValue(email);
      await this.enterPasscode.enterPasscode(invalidPasscode);
      await this.elements.loginButton().click();
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async verifyInvalidPasscodeErrorMessage() {
    try {
      await this.elements.message().waitForDisplayed({
        timeout: 60000,
        timeoutMsg: "No error message was displayed",
      });

      await expect(this.elements.title()).toHaveText("Login Failed");
      await expect(this.elements.message()).toHaveText(
        "Invalid credentials. 2 attempts remaining"
      );
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async verifyLockedAccountMessage() {
    try {
      await this.elements.message().waitForDisplayed({
        timeout: 60000,
        timeoutMsg: "No error message was displayed",
      });

      await expect(this.elements.title()).toHaveText("Login Failed");
      await expect(this.elements.message()).toHaveText(
        "Account locked due to too many failed attempts"
      );
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async loginWithInvalidCredentialsThreeTimesInArow(
    email: string,
    invalidPasscode: number
  ) {
    try {
      const errorMessages = [
        "Invalid credentials. 2 attempts remaining",
        "Invalid credentials. 1 attempts remaining",
        "Invalid credentials. 0 attempts remaining",
      ];

      await this.elements.emailInputField().setValue(email);
      await this.enterPasscode.enterPasscode(invalidPasscode);

      for (let attempt = 0; attempt < 3; attempt++) {
        await this.elements.loginButton().click();

        await this.elements.message().waitForDisplayed({
          timeout: 60000,
          timeoutMsg: "No error message was displayed",
        });

        await expect(this.elements.title()).toHaveText("Login Failed");
        await expect(this.elements.message()).toHaveText(
          errorMessages[attempt]
        );

        if (attempt < 3) {
          await this.elements.actionButton().click();
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async loginWithNonExsistentAccount(email: string, passcode: number) {
    try {
      await this.elements.emailInputField().setValue(email);
      await this.enterPasscode.enterPasscode(passcode);
      await this.elements.loginButton().click();
    } catch (error) {
      console.log("Error:", error);
    }
  }

  async verifyNonExistentAccountErrorMessage() {
    try {
      await this.elements.message().waitForDisplayed({
        timeout: 60000,
        timeoutMsg: "No error message was displayed",
      });

      await expect(this.elements.title()).toHaveText("Login Failed");
      await expect(this.elements.message()).toHaveText(
        "Account does not exist"
      );
    } catch (error) {
      console.log("Error:", error);
    }
  }
}
