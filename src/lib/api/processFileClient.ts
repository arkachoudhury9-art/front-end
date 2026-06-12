"use client";

import { logClient } from "@/lib/client/log";
import { PROCESS_FILE_ENDPOINT, USE_MOCK_API } from "@/lib/api/config";

/** Client-only: trigger backend file processing. */
export async function processFileClient(): Promise<void> {
  logClient("process-file", "request", {
    method: "GET",
    url: PROCESS_FILE_ENDPOINT,
  });

  if (USE_MOCK_API) {
    logClient("process-file", "using mock success");
    return;
  }

  const response = await fetch(PROCESS_FILE_ENDPOINT, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  logClient("process-file", "response status", {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
  });

  if (!response.ok) {
    console.error(
      `[client][process-file] request failed (${response.status} ${response.statusText})`,
    );
  }
}
