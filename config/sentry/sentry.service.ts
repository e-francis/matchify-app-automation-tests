import * as Sentry from "@sentry/node";
import { container, singleton } from "tsyringe";

@singleton()
export class SentryService {
  constructor() {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        Sentry.rewriteFramesIntegration({
          root: global.__dirname || "/", // Use '/' as fallback if __dirname is undefined
          prefix: "app://",
          iteratee: (frame) => {
            if (frame.filename) {
              frame.filename = frame.filename.replace(
                "/absolute/path/to/project/",
                "app://"
              );
            }
            return frame;
          },
        }),
      ],
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV || "test",
    });
  }

  async captureTestError(
    error: Error | string,
    metadata: {
      scenarioName: string;
      stepText?: string;
      screenshotPath?: string;
      browserLogs?: any[];
      deviceInfo?: any;
      platformInfo?: any;
    }
  ): Promise<string> {
    const errorObj = error instanceof Error ? error : new Error(error);

    const eventId = Sentry.captureException(errorObj, {
      extra: {
        ...metadata,
        timestamp: new Date().toISOString(),
        originalError: error,
      },
      tags: {
        scenarioName: metadata.scenarioName,
        framework: "webdriverio-cucumber",
        device: metadata.deviceInfo?.deviceName || "local",
        platform: metadata.platformInfo?.platformName || "local",
        environment: process.env.NODE_ENV || "test",
      },
    });

    await Sentry.flush(2000); // Flush queued events before returning
    return eventId;
  }
}

// Register the service
container.registerSingleton(SentryService);
