import { ANOMALY_HIST_ENDPOINT } from "@/lib/api/config";

function isConnectionRefused(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const err = error as { code?: string; message?: string; cause?: unknown };

  if (err.code === "ECONNREFUSED") {
    return true;
  }

  if (
    typeof err.message === "string" &&
    (err.message.toLowerCase().includes("fetch failed") ||
      err.message.toLowerCase().includes("failed to fetch") ||
      err.message.toLowerCase().includes("econnrefused"))
  ) {
    return true;
  }

  if (err.cause) {
    return isConnectionRefused(err.cause);
  }

  return false;
}

export function formatFetchError(error: unknown): string {
  if (isConnectionRefused(error)) {
    return `Unable to reach the anomaly API at ${ANOMALY_HIST_ENDPOINT}. Ensure the backend server is running.`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred while fetching anomalies.";
}
