import { injectable } from "tsyringe";
import { selectors } from "../../../config/environment";

@injectable()
export default class HandleNetworkError {
  private readonly selectors = selectors;

  private readonly elements = {
    message: () => $(this.selectors.commonSelectors.message),
    title: () => $(this.selectors.commonSelectors.title),
    actionButton: () => $(this.selectors.commonSelectors.actionButton),
    loginButton: () => $(this.selectors.loginSelectors.loginButton),
  };

  async handleNetworkError(maxRetries: number = 2): Promise<boolean> {
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
    return false;
  }
}
