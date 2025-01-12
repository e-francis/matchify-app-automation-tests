import "reflect-metadata";
import dotenv from "dotenv";
import * as os from "os";
import { container } from "tsyringe";
import App from "../src/screens/app.ts";
import Login from "../src/screens/auth/login.ts";
import { SentryService } from "./sentry/sentry.service.ts";
import {
  createUser,
  createNewUser,
  loginCredentials,
} from "../src/utils/api/api.service.utils.ts";

import { config as cucumberConfig } from "./wdio.cucumber.conf.ts";

dotenv.config();

container.registerSingleton(App);
container.registerSingleton(Login);

export const config: WebdriverIO.Config = {
  ...cucumberConfig,

  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  hostname: "hub.browserstack.com",

  reporters: [
    "spec",
    [
      "allure",
      {
        outputDir: "test-reports/allure-results",
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
        reportedEnvironmentVars: {
          os_platform: os.platform(),
          os_release: os.release(),
          os_version: os.version(),
          node_version: process.version,
        },
        useCucumberStepReporter: true,
      },
    ],
    "cucumberjs-json",
  ],

  services: [
    [
      "browserstack",
      {
        app: process.env.BROWSERSTACK_APP || "./app/matchify.apk",
        buildIdentifier:
          process.env.BUILD_NUMBER || `local-build-${Date.now()}`,
        browserstackLocal: true,
      },
    ],
  ],

  capabilities: [
    {
      "bstack:options": {
        deviceName: "Samsung Galaxy S24 Ultra",
        platformVersion: "14.0",
        platformName: "android",
        projectName: "MATCHIFY",
        buildName: "browserstack build",
        sessionName: "BStack parallel webdriverio-appium",
        debug: true,
        networkLogs: true,
      },
    },
    
  ] as WebdriverIO.Capabilities[],

  onPrepare: async function () {
    const fs = await import("fs");
    const path = await import("path");

    const screenshotDir = "./screenshots";
    const allureResultsDir = "./test-reports/allure-results";
    const allureReportDir = "./test-reports/allure-report";

    const clearDirectory = (dir: string) => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          if (fs.lstatSync(filePath).isDirectory()) {
            clearDirectory(filePath);
            fs.rmdirSync(filePath);
          } else {
            fs.unlinkSync(filePath);
          }
        }
        console.log(`Cleared directory: ${dir}`);
      } else {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    };

    [screenshotDir, allureResultsDir, allureReportDir].forEach((dir) => {
      try {
        clearDirectory(dir);
      } catch (error) {
        console.error(`Error handling directory ${dir}:`, error);
      }
    });
  },

  beforeSession: function () {
    require("events").EventEmitter.defaultMaxListeners = 1000;
    require("reflect-metadata");
  },

  before: async function () {
    console.log("Setting up test environment");
    const app = container.resolve(App);
    console.log("App instance created:", app);
  },

  beforeScenario: async function (world) {
    try {
      await browser.pause(5000);

      if (world.pickle.tags.some((tag) => tag.name === "@createProfile")) {
        await createUser(createNewUser);

        if (!loginCredentials) {
          throw new Error("Profile creation failed - no credentials available");
        }
      }

      console.log(`App reset completed before scenario: ${world.pickle.name}`);
    } catch (error) {
      console.error("Error in beforeScenario hook:", error);
      throw error;
    }
  },

  afterStep: async function (step, scenario, { error, passed }) {
    if (error || !passed) {
      const sentryService = container.resolve(SentryService);
      const date = new Date();
      const timestamp = date.toISOString().replace(/[^0-9]/g, "");

      try {
        const fs = await import("fs");
        const path = await import("path");
        const screenshotDir = "./screenshots";

        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir);
        }

        const scenarioName = scenario.name.replace(/[^a-zA-Z0-9]/g, "_");
        const stepText = step.text.replace(/[^a-zA-Z0-9]/g, "_");
        const filepath = path.join(
          screenshotDir,
          `${scenarioName}-${stepText}-${timestamp}.png`
        );

        await browser.saveScreenshot(filepath);

        if (error) {
          await sentryService.captureTestError(error, {
            scenarioName: scenario.name,
            stepText: step.text,
            screenshotPath: filepath,
            browserLogs: await browser.getLogs("browser"),
          });
        }
      } catch (err) {
        console.error("Failed to capture screenshot:", err);
        if (error) {
          await sentryService.captureTestError(error, {
            scenarioName: scenario.name,
            stepText: step.text,
          });
        }
      }
    }
  },

  afterScenario: async function (world, result) {
    const date = new Date();
    const timestamp = date.toISOString().replace(/[^0-9]/g, "");

    try {
      const fs = await import("fs");
      const path = await import("path");
      const screenshotDir = "./screenshots";

      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir);
      }

      const status = result.passed ? "pass" : "failure";
      const filepath = path.join(
        screenshotDir,
        `scenario-${status}-${world.pickle.name.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        )}-${timestamp}.png`
      );

      await browser.saveScreenshot(filepath);

      const sentryService = container.resolve(SentryService);
      // If scenario failed, send to Sentry
      if (!result.passed && result.error) {
        try {
          const errorToSend =
            typeof result.error === "string"
              ? result.error
              : (result.error as unknown) instanceof Error
              ? result.error
              : new Error(JSON.stringify(result.error));

          await sentryService.captureTestError(errorToSend, {
            scenarioName: world.pickle.name,
            browserLogs: await browser.getLogs("browser"),
          });
        } catch (err) {
          console.error("Failed to send error to Sentry:", err);
        }
      }
    } catch (err) {
      console.error("Failed to capture screenshot:", err);
    }

    await browser.pause(10000);
    await browser.reloadSession();
  },

  onComplete: async () => {
    try {
      const childProcess = await import("node:child_process");

      // Generate Allure report
      childProcess.exec(
        "allure generate test-reports/allure-results --clean -o tes-reports/allure-report",
        (error: Error | null) => {
          if (error) {
            console.error("Failed to generate Test report:", error);
            return;
          }
          console.log("Test Report Successfully Generated");
        }
      );
    } catch (error) {
      console.error("Failed To Generate Test report:", error);
    }
  },
};
