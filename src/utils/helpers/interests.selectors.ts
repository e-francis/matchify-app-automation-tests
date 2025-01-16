import { selectors } from "../../../config/environment.ts";

export default class SelectRandomInterests {
  private readonly selectors = selectors;

  private readonly elements = {
    music: () => $(this.selectors.interestSelectors.music),
    sports: () => $(this.selectors.interestSelectors.sports),
    travel: () => $(this.selectors.interestSelectors.travel),
    reading: () => $(this.selectors.interestSelectors.reading),
    movies: () => $(this.selectors.interestSelectors.movies),
    food: () => $(this.selectors.interestSelectors.food),
    art: () => $(this.selectors.interestSelectors.art),
    photography: () => $(this.selectors.interestSelectors.photography),
    gaming: () => $(this.selectors.interestSelectors.gaming),
    fashion: () => $(this.selectors.interestSelectors.fashion),
    technology: () => $(this.selectors.interestSelectors.technology),
    fitness: () => $(this.selectors.interestSelectors.fitness),
  };

  private async getRandomInterests(
    count: 5 | 6
  ): Promise<(keyof typeof this.elements)[]> {
    const keys = Object.keys(this.elements) as (keyof typeof this.elements)[];
    const randomIndexes = new Set<number>();

    while (randomIndexes.size < count) {
      randomIndexes.add(Math.floor(Math.random() * keys.length));
    }

    return Array.from(randomIndexes).map((index) => keys[index]);
  }

  private async clickInterest(
    interest: keyof typeof this.elements
  ): Promise<void> {
    const element = this.elements[interest]();
    await element.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: `${interest} interest button not displayed`,
    });
    await element.click();
  }

  async clickSelectedInterests(count: 5 | 6): Promise<void> {
    const selectedInterests = await this.getRandomInterests(count);

    for (const interest of selectedInterests) {
      await this.clickInterest(interest);
      await browser.pause(300);
    }
  }

  async selectFiveInterests(): Promise<void> {
    await this.clickSelectedInterests(5);
  }

  async selectSixInterests(): Promise<void> {
    await this.clickSelectedInterests(6);
  }
}
