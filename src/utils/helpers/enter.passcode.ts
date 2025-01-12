import { selectors } from "../../../config/environment.ts";

export default class EnterPasscode {
  private readonly selectors = selectors;
  private readonly elements = {
    enterPasscode: () => $(this.selectors.commonSelectors.passcodeInputField),
    confrimPasscode: () =>
      $(this.selectors.onboardingSelectors.confrimPasscodeInputField),
  };

  async enterPasscode(passcode: number) {
    try {
      await this.elements.enterPasscode().setValue(passcode);
    } catch (error) {
      console.error("Error in entering passcode:", error);
      throw error;
    }
  }

  async enterPasscodes(passcode: number, confrimPasscode: number) {
    try {
      await this.elements.enterPasscode().setValue(passcode);
      await this.elements.confrimPasscode().setValue(confrimPasscode);
    } catch (error) {
      console.error("Error in setting passcodes:", error);
      throw error;
    }
  }
}
