import { selectors } from "../../../config/environment.ts";

export class GenderPickerHelper {
  private readonly selectors = selectors;

  public async selectRandomGender() {
    try {
      const random = Math.random();
      let genderSelector: string;

      if (random < 0.33) {
        genderSelector = this.selectors.genderSelectors.male;
      } else if (random < 0.66) {
        genderSelector = this.selectors.genderSelectors.female;
      } else {
        genderSelector = this.selectors.genderSelectors.other;
      }

      const genderElement = await $(genderSelector);
      await genderElement.waitForDisplayed({ timeout: 5000 });
      await genderElement.click();
    } catch (error) {
      console.error("Error slecting gender:", error);
      throw error;
    }
  }
}
