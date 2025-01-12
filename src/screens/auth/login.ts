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
    greeting: () => $(this.selectors.loginSelectors.greeting),
  };

  private async handleNetworkError(maxRetries: number = 2) {
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const messageText = await this.elements.message().getText();
        const titleText = await this.elements.title().getText();

        if (
          messageText === "Network Error: Check your connection" &&
          titleText === "Login Failed"
        ) {
          retryCount++;
          console.log(
            `Network error detected. Attempt ${retryCount} of ${maxRetries}`
          );

          await browser.pause(5000);
          await this.elements.actionButton().click();
          await browser.pause(5000);
          await this.elements.loginButton().click();
          continue;
        }

        return false;
      } catch (error) {
        console.log(`Error during login (attempt ${retryCount + 1}):`, error);
        retryCount++;
        if (retryCount === maxRetries) {
          return false;
        }
        await browser.pause(2000);
      }
    }
  }

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

      const isNetworkError = await this.handleNetworkError();
      if (isNetworkError) {
        throw new Error("Network connectivity issue detected");
      }

      await expect(this.elements.title()).toHaveText("Login Successful");
      await expect(this.elements.message()).toHaveText("Welcome back!");
      await this.elements.actionButton().click();
      await this.elements.greeting().waitForDisplayed({
        timeout: 60000,
        timeoutMsg: "User not navigated to dashboard",
      });
      await expect(this.elements.greeting()).toHaveText(
        expect.stringMatching(/^Hello, [A-Z][a-z]+!$/)
      );
    } catch (error) {
      console.log("Error:", error);
      throw error;
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

      const isNetworkError = await this.handleNetworkError();
      if (isNetworkError) {
        throw new Error("Network connectivity issue detected");
      }

      await expect(this.elements.message()).toHaveText(
        "Invalid credentials. 2 attempts remaining"
      );
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  }

  async verifyLockedAccountMessage() {
    try {
      await this.elements.loginButton().click();
      await this.elements.message().waitForDisplayed({
        timeout: 60000,
        timeoutMsg: "No error message was displayed",
      });

      await expect(this.elements.message()).toHaveText(
        "Account locked due to too many failed attempts"
      );

      const isNetworkError = await this.handleNetworkError();
      if (isNetworkError) {
        throw new Error("Network connectivity issue detected");
      }
    } catch (error) {
      console.log("Error:", error);
      throw error;
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

  async loginWithNonExistentAccount(email: string, passcode: number) {
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

      const isNetworkError = await this.handleNetworkError();
      if (isNetworkError) {
        throw new Error("Network connectivity issue detected");
      }

      await expect(this.elements.title()).toHaveText("Login Failed");
      await expect(this.elements.message()).toHaveText(
        "Account does not exist"
      );
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  }

  async loginWithValidCredentialsAfterInvalidCredentials(
    email: string,
    invalidPasscode: number,
    validPasscode: number
  ) {
    try {
      await this.loginWithInvalidCredentials(email, invalidPasscode);
      await this.verifyInvalidPasscodeErrorMessage();
      await this.elements.actionButton().click();

      await this.loginWithValidCredentials(email, validPasscode);
    } catch (error) {
      console.log("Error during login sequence:", error);
      throw error;
    }
  }
}
