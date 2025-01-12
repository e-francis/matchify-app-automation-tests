import * as Sentry from "@sentry/node";
import axios from "axios";
import { container, singleton } from "tsyringe";

@singleton()
export class SentryService {
  private sentryApiUrl = "https://sentry.io/api/0";
  private sentryAuthToken = process.env.SENTRY_API_TOKEN;

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

    await Sentry.flush(2000);
    return eventId;
  }

  async getErrors(runId: string): Promise<
    {
      scenarioName: string;
      timestamp: string;
      details: string;
    }[]
  > {
    if (!this.sentryAuthToken) {
      throw new Error("Sentry API token is not configured.");
    }

    try {
      const response = await axios.get(
        `${this.sentryApiUrl}/projects/${process.env.SENTRY_ORG}/${process.env.SENTRY_PROJECT}/issues/`,
        {
          headers: {
            Authorization: `Bearer ${this.sentryAuthToken}`,
          },
          params: {
            query: `runId:${runId}`,
          },
        }
      );

      return response.data.map((issue: any) => ({
        scenarioName: issue.title,
        timestamp: issue.lastSeen,
        details: issue.culprit || "No details available",
      }));
    } catch (error) {
      console.error("Failed to fetch errors from Sentry:", error);
      throw error;
    }
  }
}

container.registerSingleton(SentryService);
