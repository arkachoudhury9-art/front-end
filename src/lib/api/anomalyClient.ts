import {
  ANOMALY_HIST_ENDPOINT,
  USE_MOCK_API,
} from "@/lib/api/config";
import { formatFetchError } from "@/lib/api/errors";
import { mapApiAnomaliesToUi } from "@/lib/mappers/anomalyMapper";
import { mockAnomalyHistResponse } from "@/lib/mock/anomalyHistResponse";
import type { AnomalyHistResponse } from "@/types/api";
import type { AnomaliesResult } from "@/types/anomaly";

async function fetchAnomalyHistFromApi(): Promise<AnomalyHistResponse> {
  const response = await fetch(ANOMALY_HIST_ENDPOINT, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
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

  return data;
}

export async function fetchAnomaliesClient(): Promise<AnomaliesResult> {
  try {
    const response = USE_MOCK_API
      ? mockAnomalyHistResponse
      : await fetchAnomalyHistFromApi();

    return {
      anomalies: mapApiAnomaliesToUi(response.anomalies),
      error: null,
      source: USE_MOCK_API ? "mock" : "api",
    };
  } catch (error) {
    console.error("[anomaly_hist] client fetch failed:", error);

    return {
      anomalies: [],
      error: formatFetchError(error),
      source: USE_MOCK_API ? "mock" : "api",
    };
  }
}
