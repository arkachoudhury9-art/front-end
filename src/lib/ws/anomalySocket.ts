import {
  ANOMALY_WS_URL,
  USE_MOCK_WEBSOCKET,
} from "@/lib/api/config";
import { getNextMockWebSocketMessage } from "@/lib/mock/anomalyWebSocketMessages";
import type { AnomalyWebSocketMessage } from "@/types/websocket";

export type AnomalySocketListener = (message: AnomalyWebSocketMessage) => void;

const MOCK_INTERVAL_MS = 8000;
const MOCK_INITIAL_DELAY_MS = 2000;

function parseMessage(data: unknown): AnomalyWebSocketMessage | null {
  try {
    if (typeof data !== "string") {
      return null;
    }

    const parsed = JSON.parse(data) as AnomalyWebSocketMessage;

    if (
      typeof parsed.asset_id !== "string" ||
      typeof parsed.anomaly_detected !== "boolean"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function createMockSocket(onMessage: AnomalySocketListener): () => void {
  let intervalId: ReturnType<typeof setInterval> | null = null;

  const emit = () => {
    onMessage(getNextMockWebSocketMessage());
  };

  const initialTimeout = setTimeout(emit, MOCK_INITIAL_DELAY_MS);
  intervalId = setInterval(emit, MOCK_INTERVAL_MS);

  return () => {
    clearTimeout(initialTimeout);
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}

function createLiveSocket(onMessage: AnomalySocketListener): () => void {
  let socket: WebSocket | null = null;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let closed = false;

  const connect = () => {
    if (closed) return;

    socket = new WebSocket(ANOMALY_WS_URL);

    socket.onmessage = (event) => {
      const message = parseMessage(event.data);
      if (message) {
        onMessage(message);
      }
    };

    socket.onclose = () => {
      if (!closed) {
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };

    socket.onerror = () => {
      socket?.close();
    };
  };

  connect();

  return () => {
    closed = true;
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
    socket?.close();
  };
}

export function connectAnomalySocket(
  onMessage: AnomalySocketListener,
): () => void {
  if (USE_MOCK_WEBSOCKET) {
    console.info("[ws/anomaly] using mock WebSocket");
    return createMockSocket(onMessage);
  }

  console.info("[ws/anomaly] connecting to", ANOMALY_WS_URL);
  return createLiveSocket(onMessage);
}
