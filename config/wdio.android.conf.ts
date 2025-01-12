import { config as sharedConfig } from "./wdio.shared.conf.ts";

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  capabilities: [
    {
      "wdio:maxInstances": 1,
      platformName: "Android",
      "appium:deviceName": "Pixel-7-Pro",
      "appium:automationName": "UiAutomator2",
      "appium:appPackage": "com.matchify",
      "appium:noReset": false,
      "appium:appActivity": "com.matchify.presentation.WelcomeActivity",
      "appium:ignoreHiddenApiPolicyError": true,
      "appium:autoGrantPermissions": true,
      "appium:hideKeyboard": true,
    },
  ],
};
