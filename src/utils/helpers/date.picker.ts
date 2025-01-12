import { selectors } from "../../../config/environment.ts";

export class DatePickerHelper {
  private readonly selectors = selectors;

  public async setYear(targetYear: string) {
    try {
      const yearPicker = await $(this.selectors.datePicker.selectYear);
      await yearPicker.click();

      const performSwipe = async (direction: "up" | "down") => {
        const elementLoc = await yearPicker.getLocation();
        const elementSize = await yearPicker.getSize();

        const startX = Math.round(elementLoc.x + elementSize.width / 2);
        const endX = startX;
        const swipeDistance = elementSize.height * 0.9;

        const startY =
          direction === "down"
            ? Math.round(elementLoc.y + elementSize.height * 0.9)
            : Math.round(elementLoc.y + elementSize.height * 0.1);
        const endY =
          direction === "down"
            ? startY - swipeDistance
            : startY + swipeDistance;

        await driver.performActions([
          {
            type: "pointer",
            id: "finger1",
            parameters: { pointerType: "touch" },
            actions: [
              {
                type: "pointerMove",
                duration: 0,
                x: startX,
                y: startY,
              },
              { type: "pointerDown", button: 0 },
              { type: "pause", duration: 100 },
              {
                type: "pointerMove",
                duration: 500,
                x: endX,
                y: endY,
              },
              { type: "pointerUp", button: 0 },
            ],
          },
        ]);
        await browser.pause(300);
      };

      let currentYear = await yearPicker.getText();
      console.log("Starting year:", currentYear);
      let attempts = 0;
      const maxAttempts = 100;

      while (currentYear !== targetYear && attempts < maxAttempts) {
        const direction =
          parseInt(currentYear) > parseInt(targetYear) ? "up" : "down";
        await performSwipe(direction);
        currentYear = await yearPicker.getText();
        console.log("Current year after swipe:", currentYear);
        attempts++;
      }

      if (currentYear !== targetYear) {
        throw new Error(
          `Failed to set year to ${targetYear} after ${maxAttempts} attempts`
        );
      }
    } catch (error) {
      console.error("Error in setYear:", error);
      throw error;
    }
  }
}
