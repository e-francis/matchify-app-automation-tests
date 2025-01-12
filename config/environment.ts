import androidSelectors from "../src/utils/locators/locators.android.json";
import iosLocators from "../src/utils/locators/locators.ios.json";

export const selectors =
  process.env.PLATFORM === "android" ? androidSelectors : iosLocators;
