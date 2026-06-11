"use client";

import { logClient } from "@/lib/client/log";
import {
  ANOMALY_HIST_ENDPOINT,
  USE_MOCK_API,
} from "@/lib/api/config";
import { formatFetchError } from "@/lib/api/errors";
import { mapApiAnomaliesToUi } from "@/lib/mappers/anomalyMapper";
import { mockAnomalyHistResponse } from "@/lib/mock/anomalyHistResponse";
import { getLiveAnomalyById } from "@/lib/store/anomalyStore";
import type { AnomalyHistResponse } from "@/types/api";
import type { AnomaliesResult, Anomaly } from "@/types/anomaly";

async function fetchAnomalyHistFromApi(): Promise<AnomalyHistResponse> {
  logClient("anomaly_hist", "request", {
    method: "GET",
    url: ANOMALY_HIST_ENDPOINT,
  });

  const response = await fetch(ANOMALY_HIST_ENDPOINT, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  logClient("anomaly_hist", "response status", {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch anomaly history (${response.status} ${response.statusText})`,
    );
  }

  const data = (await response.json()) as AnomalyHistResponse;

  if (!data || !Array.isArray(data.anomalies)) {
    throw new Error(
      "Invalid anomaly history response: expected { anomalies: [] }",
    );
  }

  logClient("anomaly_hist", "response body", data);
  return data;
}

/** Client-only: initial page load from anomaly_hist. */
export async function fetchAnomaliesClient(): Promise<AnomaliesResult> {
  try {
    if (USE_MOCK_API) {
      logClient("anomaly_hist", "using mock response", mockAnomalyHistResponse);
    }

    const response = USE_MOCK_API
      ? mockAnomalyHistResponse
      : await fetchAnomalyHistFromApi();

    const result: AnomaliesResult = {
      anomalies: mapApiAnomaliesToUi(response.anomalies),
      error: null,
      source: USE_MOCK_API ? "mock" : "api",
    };

    logClient("anomaly_hist", "mapped result", result);
    return result;
  } catch (error) {
    logClient("anomaly_hist", "fetch failed", error);
    console.error("[client][anomaly_hist] fetch failed:", error);

    return {
      anomalies: [],
      error: formatFetchError(error),
      source: USE_MOCK_API ? "mock" : "api",
    };
  }
}

export async function fetchAnomalyByIdClient(id: string): Promise<{
  anomaly?: Anomaly;
  error: string | null;
}> {
  const liveAnomaly = getLiveAnomalyById(id);
  if (liveAnomaly) {
    logClient("anomaly_lookup", `live anomaly id=${id}`, liveAnomaly);
    return { anomaly: liveAnomaly, error: null };
  }

  const result = await fetchAnomaliesClient();
  const anomaly = result.anomalies.find((item) => item.id === id);

  logClient("anomaly_lookup", `history anomaly id=${id}`, {
    anomaly,
    error: result.error,
  });

  return {
    anomaly,
    error: result.error,
  };
}
