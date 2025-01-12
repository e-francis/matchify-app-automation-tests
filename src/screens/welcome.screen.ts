import { selectors } from "../../config/environment.ts";
import { injectable } from "tsyringe";

@injectable()
export default class LaunchApp {
  constructor() {
    console.log("Current PLATFORM:", process.env.PLATFORM);
    console.log("Selected selectors:", this.selectors);
  }

  private readonly selectors = selectors;

  private readonly elements = {
    createNewAccountButton: () =>
      $(this.selectors.commonSelectors.createAccountButton),
    loginButton: () => $(this.selectors.welcomeScreenSelectors.loginButton),
    loginText: () => $(this.selectors.loginSelectors.loginText),
    welcomeText: () => $(this.selectors.welcomeScreenSelectors.welcomeText),
    createAccounText: () =>
      $(this.selectors.onboardingSelectors.createAccounText),
    emailInputField: () => $(this.selectors.commonSelectors.emailInputField),
    passcodeInputField: () =>
      $(this.selectors.commonSelectors.passcodeInputField),
  };

  async onAppLaunchLogin() {
    try {
      console.log("Starting app launch sequence...");

      await this.elements.welcomeText().waitForDisplayed({
        timeout: 10000,
        timeoutMsg: "App not launched",
      });

      await expect(this.elements.welcomeText()).toHaveText("Matchify");

      await browser.pause(5000);

      await this.elements.loginButton().waitForDisplayed({
        timeout: 30000,
        timeoutMsg: "Login button not displayed after 30s",
      });
      await this.elements.loginButton().click();
      await expect(this.elements.loginText()).toHaveText("Login");

      await browser.waitUntil(
        async () => {
          const emailFieldVisible = await this.elements
            .emailInputField()
            .isDisplayed()
            .catch(() => false);
          const passcodeFieldVisible = await this.elements
            .passcodeInputField()
            .isDisplayed()
            .catch(() => false);
          return emailFieldVisible && passcodeFieldVisible;
        },
        {
          timeout: 30000,
          interval: 1000,
          timeoutMsg: "Login screen not fully loaded after 30s",
        }
      );

      console.log(
        "App launch and navigation to login screen completed successfully"
      );
      return true;
    } catch (error) {
      console.error("Failed during app launch:", error);
      throw error;
    }
  }

  async onAppLaunchOnboarding() {
    try {
      console.log("Starting onboarding launch sequence...");

      await this.elements.welcomeText().waitForDisplayed({
        timeout: 10000,
        timeoutMsg: "App not launched",
      });

      await expect(this.elements.welcomeText()).toHaveText("Matchify");

      await this.elements.createNewAccountButton().waitForDisplayed({
        timeout: 30000,
        timeoutMsg: "Create account button not displayed after 30s",
      });
      await this.elements.createNewAccountButton().click();
      await expect(this.elements.createAccounText()).toHaveText(
        "Create Your Account"
      );

      console.log(
        "Onboarding launch and navigation to sign-up screen completed successfully"
      );
      return true;
    } catch (error) {
      console.error("Failed during onboarding launch:", error);
      throw error;
    }
  }
}
