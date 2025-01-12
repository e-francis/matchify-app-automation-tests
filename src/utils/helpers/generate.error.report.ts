import { container } from "tsyringe";
import { SentryService } from "../../../config/sentry/sentry.service";
import * as fs from "fs";
import * as path from "path";

interface ErrorDetails {
  scenarioName: string;
  timestamp: string;
  details: string;
}

export class ErrorReportGenerator {
  static async generateReport(runId: string): Promise<void> {
    const sentryService = container.resolve(SentryService);

    const reportData: {
      runId: string;
      timestamp: string;
      errors: ErrorDetails[];
    } = {
      runId,
      timestamp: new Date().toISOString(),
      errors: await sentryService.getErrors(runId), 
    };

    const escapeHtml = (text: string) =>
      text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const html = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Test Automation Error Report</title>
                </head>
                <body>
                    <h1>Error Report - ${reportData.timestamp}</h1>
                    <div id="errors">
                        ${reportData.errors
                          .map(
                            (error) => `
                                <div class="error">
                                    <h3>${escapeHtml(error.scenarioName)}</h3>
                                    <p>Timestamp: ${escapeHtml(
                                      error.timestamp
                                    )}</p>
                                    <pre>${escapeHtml(error.details)}</pre>
                                </div>
                            `
                          )
                          .join("")}
                    </div>
                </body>
            </html>
        `;

    const reportsDir = path.resolve("./test-reports/error-reports/sentry-error-report");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    try {
      fs.writeFileSync(
        path.join(reportsDir, `error-report-${runId}.html`),
        html
      );
    } catch (err) {
      console.error("Failed to write error report:", err);
      throw err;
    }
  }
}
