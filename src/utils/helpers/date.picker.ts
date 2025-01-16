import { selectors } from "../../../config/environment.ts";
export default class DatePickerHelper {
  private readonly selectors = selectors;

  private readonly elements = {
    yearPickerHeader: () => $(this.selectors.datePicker.year),
    selectYear: () => $(this.selectors.datePicker.selectYear),
  };

  public async setYear() {
    try {
      await this.elements.yearPickerHeader().click();

      while (true) {
        await browser.swipe({
          direction: "up",
        });

        const yearElement = this.elements.selectYear();
        const isDisplayed = await yearElement.waitForDisplayed({
          timeout: 60000,
          reverse: false,
        });

        if (isDisplayed) {
          await yearElement.click();
          return;
        }
      }
    } catch (error) {
      console.error("Year selection failed!", error);
      throw error;
    }
  }
}
