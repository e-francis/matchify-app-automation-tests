import { selectors } from "../../../config/environment.ts";

export default class SelectRandomLocation {
  private readonly selectors = selectors;

  private readonly elements = {
    selectNewYork: () => $(this.selectors.locationsSelectors.newYork),
    selectLondon: () => $(this.selectors.locationsSelectors.london),
    selectParis: () => $(this.selectors.locationsSelectors.paris),
    selectTokyo: () => $(this.selectors.locationsSelectors.tokyo),
    selectSydney: () => $(this.selectors.locationsSelectors.sydney),
  };

  public async selectRandomLocation() {
    try {
      const locations = [
        this.elements.selectNewYork(),
        this.elements.selectLondon(),
        this.elements.selectParis(),
        this.elements.selectTokyo(),
        this.elements.selectSydney(),
      ];

      const randomLocationElement =
        locations[Math.floor(Math.random() * locations.length)];

      await randomLocationElement.waitForDisplayed({ timeout: 10000 });
      await randomLocationElement.click();
      await browser.pause(2000);
    } catch (error) {
      console.error("Error selecting location:", error);
      throw error;
    }
  }
}
