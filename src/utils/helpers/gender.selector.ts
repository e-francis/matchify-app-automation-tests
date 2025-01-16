import { selectors } from "../../../config/environment.ts";

export default class SelectRandomGender {
  private readonly selectors = selectors;

  private readonly elements = {
    selectMale: () => $(this.selectors.genderSelectors.male),
    selectFemale: () => $(this.selectors.genderSelectors.female),
    selectOther: () => $(this.selectors.genderSelectors.other),
  };

  async selectRandomGender() {
    try {
      const genderElements = [
        this.elements.selectMale(),
        this.elements.selectFemale(),
        this.elements.selectOther(),
      ];

      const randomGenderElement =
        genderElements[Math.floor(Math.random() * genderElements.length)];

      await randomGenderElement.waitForDisplayed({ timeout: 5000 });
      await randomGenderElement.click();
      await browser.pause(3000);
    } catch (error) {
      console.error("Error selecting gender:", error);
      throw error;
    }
  }
}
