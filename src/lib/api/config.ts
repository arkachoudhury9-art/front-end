export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

/** Set to false (or NEXT_PUBLIC_USE_MOCK_API=false) to call the live API. */
export const USE_MOCK_API =
  process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

export const ANOMALY_HIST_ENDPOINT = `${API_BASE_URL}/anomaly_hist`;
