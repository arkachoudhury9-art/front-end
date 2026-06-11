export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

/** Set to false (or NEXT_PUBLIC_USE_MOCK_API=false) to call the live API. */
export const USE_MOCK_API =
  process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

export const ANOMALY_HIST_ENDPOINT = `${API_BASE_URL}/anomaly_hist`;

/** Set to false (or NEXT_PUBLIC_USE_MOCK_WEBSOCKET=false) to use the live WebSocket. */
export const USE_MOCK_WEBSOCKET =
  process.env.NEXT_PUBLIC_USE_MOCK_WEBSOCKET !== "false";

export const ANOMALY_WS_URL =
  process.env.NEXT_PUBLIC_ANOMALY_WS_URL ??
  `${API_BASE_URL.replace(/^http/, "ws")}/ws/anomaly`;

/** Set to false to connect to the live reasoning WebSocket. */
export const USE_MOCK_REASONING_WEBSOCKET =
  process.env.NEXT_PUBLIC_USE_MOCK_REASONING_WEBSOCKET !== "false";

export const REASONING_WS_URL =
  process.env.NEXT_PUBLIC_REASONING_WS_URL ??
  `${API_BASE_URL.replace(/^http/, "ws")}/reasoning/events`;
