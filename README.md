### Matchify App Automation Tests
# Mobile automation testing framework for the Matchify app using WebDriverIO, TypeScript, and Cucumber.

# Features

- End-to-end testing of Matchify mobile app using WebDriverIO, TypeScript and Cucumber
- Page Object Model (POM) design pattern implementation
- Dependency injection using TSyringe for better code organization
- Cross-platform support (Android & iOS)
- BrowserStack integration for cloud testing
- Sentry integration for error tracking and monitoring
- Allure reporting with screenshots and environment details
- GitHub Actions CI/CD pipeline
- Comprehensive test coverage for login and profile creation features
- Edge cases handling for network errors and invalid uploads

## Feature Overview

### Authentication
- Login functionality with multiple validation scenarios
- Error handling for invalid credentials

### Profile Creation
- Step-by-step profile creation flow
- Image upload functionality
- Location selection
- Gender and interests selection
- Date picker implementation

## Architecture and Design Patterns

### Dependency Injection
The framework uses TSyringe for dependency injection:

```typescript
import { injectable, inject } from "tsyringe";
import LaunchApp from "./welcome.screen.ts";
import Login from "./auth/login.ts";

@injectable()
export default class App {
  constructor(
    @inject(LaunchApp) public welcomeScreen: LaunchApp,
    @inject(Login) public login: Login
  ) {}
}
```

### Page Object Model (POM)
Screen objects are organized using the POM pattern:
- `src/screens/auth/login.ts` - Login screen interactions
- `src/screens/onboarding/profile.creation.ts` - Profile creation flows
- `src/screens/welcome.screen.ts` - Welcome/launch screen

## Prerequisites

- Node.js (v18 or higher)
- Java JDK (for Appium)
- Android Studio & SDK (for Android testing)
- Appium
- BrowserStack account (for cloud testing)
- Sentry account (for error tracking)

## Project Structure and Architecture

### Directory Structure

```
matchify-app-automation-tests/
├── config/
│   ├── wdio.android.conf.ts
│   ├── wdio.ios.conf.ts
│   ├── wdio.browser.stack.conf.ts
│   ├── wdio.shared.conf.ts
│   ├── sentry.service.ts
│   └── environment.ts
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── login.feature
│   │   │   └── profile.creation.feature
│   ├── steps/
│   │   ├── auth/
│   │   └── onboarding/
│   ├── screens/
│   ├── utils/
│   │   ├── api/
│   │   ├── helpers/
│   │   └── locators/
│   └── test-data/
├── test-reports/
└── package.json

### Architecture Overview

The framework follows a layered architecture using the Page Object Model (POM) design pattern and dependency injection with TSyringe.

#### Key Components:

1. **Screens (POM Implementation)**
   - Located in `src/screens/`
   - Contains page objects for different app screens
   - Examples:
     - `auth/login.ts`: Login screen interactions
     - `onboarding/profile.creation.ts`: Profile creation screen
     - `welcome.screen.ts`: App launch/welcome screen

2. **Step Definitions**
   - Located in `src/steps/`
   - Contains Cucumber step implementations
   - Organized by feature:
     - `auth/login.step.definition.ts`
     - `onboarding/profile.creation.steps.definition.ts`

3. **Helpers**
   - Located in `src/utils/helpers/`
   - Utility classes for common operations:
     - `date.picker.ts`: Date selection helper
     - `enter.passcode.ts`: Passcode entry helper
     - `gender.selector.ts`: Gender selection helper
     - `location.selector.ts`: Location selection helper
     - `handle.network.error.ts`: Network error handling
     - `generate.error.report.ts`: Error report generation

4. **Test Artifacts**
   - Screenshots: Captured on test failure/pass in `screenshots/`
   - Reports: Generated in `test-reports/` after test execution

```
```
## Hooks

- Global Hooks

- onPrepare: For test setup

- beforeSession: For environment configuration

- before: For application initialization

- Cucumber-Specific Hooks

- beforeScenario: With profile creation support

- afterStep: With screenshot capture and error reporting

- afterScenario: For cleanup and session management

- afterScenario: For cleanup and session managementReport Generation

## The hooks handle important aspects like:

- Directory cleanup and creation

- Test environment setup

- Error tracking and reporting

- Screenshot capture

- Session management

- Report generation

```

## Setup

1. Clone the repository:
```bash
git clone https://github.com/e-francis/matchify-app-automation-tests.git
cd matchify-app-automation-tests
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following variables:

Environment Variables Description:
- `BASE_URL`: Backend API endpoint for the Matchify application
- `NODE_ENV`: Current environment (test/development/production)
- `BROWSERSTACK_USERNAME`: BrowserStack account username for cloud testing
- `BROWSERSTACK_ACCESS_KEY`: BrowserStack access key for authentication
- `SENTRY_DSN`: Sentry Data Source Name for error tracking
- `SENTRY_API_TOKEN`: Sentry API token for integration
- `SENTRY_ORG`: Sentry organization name
- `SENTRY_PROJECT`: Sentry project name

## Configuration

The framework contains several configuration files in the `config` directory:

### WebdriverIO Configurations

1. `wdio.shared.conf.ts`
   - Base configuration shared across all environments
   - Contains common settings like timeouts, reporter configurations
   - Defines base capabilities and test frameworks
   - Sets up hooks and services common to all platforms

2. `wdio.android.conf.ts`
   - Android-specific WebdriverIO configuration
   - Extends shared configuration
   - Defines Android capabilities (device name, platform version, etc.)
   - Configures Android-specific Appium settings

3. `wdio.browser.stack.conf.ts`
   - BrowserStack integration configuration
   - Sets up BrowserStack credentials and capabilities
   - Configures cloud testing environment settings
   - Defines build and project names for test organization

4. `wdio.cucumber.conf.ts`
   - Cucumber framework specific configuration
   - Sets up feature file locations
   - Configures step definition paths
   - Defines Cucumber reporter settings and options

### Error Tracking and Environment

1. `sentry.service.ts`
   - Sentry error tracking service configuration
   - Sets up error capturing and reporting

2. `environment.ts`
   - Environment variable management
   - Loads and validates required element selectors

### Usage Examples

Running tests with different configurations:

## Running Tests

### Local Execution

Run Android tests:
```bash
npm run tests:android
```


### BrowserStack Execution

```bash
npm run android:tests:browserstack
```

### Generate Reports

```bash
npm run report
```

Combined test execution and reporting:
```bash
npm run android:tests:report
npm run ios:tests:report
```

## Test Reports

The framework generates Allure reports after test execution. Reports can be found in:
```
test-reports/allure-report/
```

## CI/CD Integration

The repository includes GitHub Actions workflows for automated testing. Workflows are configured to:

- Run tests on pull requests
- Execute tests in BrowserStack
- Generate and publish test reports
- Track errors with Sentry

## Error Tracking

Sentry is integrated for error tracking and monitoring. The configuration can be found in:
```
config/sentry.service.ts
```

Key features:
- Automatic error capturing
- Error grouping and filtering

## Test Coverage

### Automated Features
1. Authentication
   - Login functionality
   - Profile creation

2. Edge Cases
   - Network error handling
   - Invalid image upload validation
   - Input validation
   - Error message verification

### Test Cases
Detailed test scenarios can be found in the feature files:
- `src/features/auth/login.feature`
- `src/features/auth/profile.creation.feature`
