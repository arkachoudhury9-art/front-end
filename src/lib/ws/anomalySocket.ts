"use client";

import { logClient } from "@/lib/client/log";
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

function emitMessage(
  onMessage: AnomalySocketListener,
  message: AnomalyWebSocketMessage,
  source: "mock" | "live",
): void {
  logClient("ws/anomaly", `${source} message`, message);
  onMessage(message);
}

function createMockSocket(onMessage: AnomalySocketListener): () => void {
  logClient("ws/anomaly", "using mock WebSocket");

  const emit = () => {
    emitMessage(onMessage, getNextMockWebSocketMessage(), "mock");
  };

  const initialTimeout = setTimeout(emit, MOCK_INITIAL_DELAY_MS);
  const intervalId = setInterval(emit, MOCK_INTERVAL_MS);

  return () => {
    clearTimeout(initialTimeout);
    clearInterval(intervalId);
  };
}

function createLiveSocket(onMessage: AnomalySocketListener): () => void {
  let socket: WebSocket | null = null;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let closed = false;

  const connect = () => {
    if (closed) return;

    logClient("ws/anomaly", "connecting", { url: ANOMALY_WS_URL });
    socket = new WebSocket(ANOMALY_WS_URL);

    socket.onopen = () => {
      logClient("ws/anomaly", "connected");
    };

    socket.onmessage = (event) => {
      logClient("ws/anomaly", "raw message", event.data);
      const message = parseMessage(event.data);
      if (message) {
        emitMessage(onMessage, message, "live");
      }
    };

    socket.onclose = () => {
      logClient("ws/anomaly", "disconnected");
      if (!closed) {
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };

    socket.onerror = (error) => {
      logClient("ws/anomaly", "error", error);
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

/** Client-only anomaly detection WebSocket. */
export function connectAnomalySocket(
  onMessage: AnomalySocketListener,
): () => void {
  if (USE_MOCK_WEBSOCKET) {
    return createMockSocket(onMessage);
  }

  return createLiveSocket(onMessage);
}
