import {
  ANOMALY_HIST_ENDPOINT,
  USE_MOCK_API,
} from "@/lib/api/config";
import { formatFetchError } from "@/lib/api/errors";
import { mapApiAnomaliesToUi } from "@/lib/mappers/anomalyMapper";
import { mockAnomalyHistResponse } from "@/lib/mock/anomalyHistResponse";
import type { AnomalyHistResponse } from "@/types/api";
import type { AnomaliesResult, Anomaly } from "@/types/anomaly";

async function fetchAnomalyHistFromApi(): Promise<AnomalyHistResponse> {
  let response: Response;

  try {
    response = await fetch(ANOMALY_HIST_ENDPOINT, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });
  } catch (error) {
    throw new Error(formatFetchError(error));
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch anomaly history (${response.status} ${response.statusText})`,
    );
  }

  try {
    const data = (await response.json()) as AnomalyHistResponse;

    if (!data || !Array.isArray(data.anomalies)) {
      throw new Error(
        "Invalid anomaly history response: expected { anomalies: [] }",
      );
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to parse anomaly history response as JSON");
  }
}

async function fetchAnomalyHist(): Promise<AnomalyHistResponse> {
  if (USE_MOCK_API) {
    return mockAnomalyHistResponse;
  }

  return fetchAnomalyHistFromApi();
}

export async function getAnomalies(): Promise<AnomaliesResult> {
  try {
    const response = await fetchAnomalyHist();

    return {
      anomalies: mapApiAnomaliesToUi(response.anomalies),
      error: null,
      source: USE_MOCK_API ? "mock" : "api",
    };
  } catch (error) {
    console.error("[anomaly_hist] fetch failed:", error);

    return {
      anomalies: [],
      error: formatFetchError(error),
      source: USE_MOCK_API ? "mock" : "api",
    };
  }
}

export async function getAnomalyById(id: string): Promise<{
  anomaly?: Anomaly;
  error: string | null;
}> {
  const result = await getAnomalies();
  const anomaly = result.anomalies.find((item) => item.id === id);

  return {
    anomaly,
    error: result.error,
  };
}
