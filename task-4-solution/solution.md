# Root Causes for Flakiness in the Flaky Test Script

1. **Timing Issues**
   - Interactions with elements were attempted before they were fully loaded or visible, leading to `Element not found` or `Element not interactable` errors.
   - Not waiting for elements to be available for key actions such as clicking the login button, filling input fields, or verifying the success message.

2. **Lack of Error Handling**
   - The script doesn’t handle exceptions effectively.
   - Errors were not logged, making debugging harder.

3. **No Retry Mechanism**
   - The script did not attempt to retry actions or requests in case of transient failures, such as network delays or slow app responses.

4. **Assumptions about Application State**
   - The script assumed that elements like the login button and input fields were always available immediately upon launching the app, leading to flakiness.

5. **Insufficient Timeout Values**
   - Lack of default timeouts to account for varying application states caused premature test failures.

---

# Steps Taken to Resolve the Issues and Improve Code Quality

- **Config File Updates**: Set appropriate timeouts and retry counts to handle transient issues.
- **Selectors and Methods**: Added `waitForDisplayed` before interacting with elements to ensure visibility.
- **Error Handling**: Included detailed error messages and screenshots for debugging failed scenarios.
- **Test File Updates**: Structured hooks (`beforeEach`, `afterEach`) for session management and better failure handling.
- **Flaky Test Debugging**: Enhanced robustness by verifying visibility before interaction and incorporating detailed error logging.
- **Refactoring**: Separated files into configuration, page objects, and spec files.

---

# Refactored Script

## **`wdio.conf.ts`**

```typescript
/**
 * WebdriverIO configuration file for Android automation.
 *
 * Enhancements:
 * - Reduced flakiness by setting appropriate timeouts.
 * - Added comments for clarity and maintainability.
 */

export const config = {
    runner: "local",
    specs: ["./test/specs/**/*.ts"],
    capabilities: [
        {
            platformName: "Android",
            "appium:deviceName": "emulator-5554",
            "appium:platformVersion": "12.0",
            "appium:automationName": "UiAutomator2",
            "appium:app": "/path/to/matchify.apk",
        },
    ],
    baseUrl: "",
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ["appium"],
    framework: "mocha",
    reporters: ["spec"],
    mochaOpts: {
        ui: "bdd",
        timeout: 60000,
    },
};
/**
 * LoginScreen class encapsulates the selectors and methods
 * for interacting with the login screen of the app.
 *
 * Enhancements:
 * - Improved error handling with detailed messages.
 * - Added screenshot capture for debugging failed attempts.
 */

export default class LoginScreen {
    // Selectors
    selectors = {
        loginButton: () => $("~loginButton"),
        usernameInputField: () => $("~usernameInput"),
        passwordInputField: () => $("~passwordInput"),
        submitButton: () => $("~submitButton"),
        successMessage: () => $("~successMessage"),
        loginText: () => $("~Login"),
    };

    /**
     * Navigates to the login screen by clicking the login button.
     */
    async navigateToLoginScreen() {
        try {
            await this.selectors.loginButton().waitForDisplayed({
                timeout: 10000,
                timeoutMsg: "Login Button did not appear after 10 seconds",
            });
            await this.selectors.loginButton().click();
            await expect(this.selectors.loginText()).toBeDisplayed();
        } catch (error) {
            throw new Error(`Failed to navigate to login screen: ${error}`);
        }
    }

    /**
     * Logs in with valid credentials.
     *
     * @param {string} username - User's username.
     * @param {string} password - User's password.
     */
    async loginWithValidCredentials(username: string, password: string) {
        try {
            await this.selectors.usernameInputField().setValue(username);
            await this.selectors.passwordInputField().setValue(password);
            await this.selectors.submitButton().click();
        } catch (error) {
            await browser.saveScreenshot(`login-error-${Date.now()}.png`);
            throw new Error(`Failed to login: ${error}`);
        }
    }

    /**
     * Verifies if the login was successful by checking for the success message.
     */
    async verifySuccessfulLogin() {
        try {
            await this.selectors.successMessage().waitForDisplayed({
                timeout: 10000,
                timeoutMsg: "Success message not displayed after login",
            });
            await expect(this.selectors.successMessage).toBeDisplayed();
        } catch (error) {
            throw new Error(`Failed to verify login success: ${error}`);
        }
    }
}

/**
 * Login Feature Test Suite
 *
 * Enhancements:
 * - Added hooks for session management and screenshot capture.
 * - Improved reliability with detailed error handling.
 */

import LoginScreen from "../../screens/login.screen";

describe("Login Feature", () => {
    let loginScreen: LoginScreen;

    before(() => {
        loginScreen = new LoginScreen();
    });

    beforeEach(async () => {
        await browser.reloadSession();
    });

    afterEach(async function () {
        if (this.currentTest?.state === "failed") {
            await browser.saveScreenshot(`test-fail-${Date.now()}.png`);
        }
    });

    it("should successfully login with valid credentials", async () => {
        await loginScreen.navigateToLoginScreen();
        await loginScreen.loginWithValidCredentials("testuser", "password123");

        const isLoginSuccessful = await loginScreen.verifySuccessfulLogin();
        expect(isLoginSuccessful).toBe(true);
    });
});
