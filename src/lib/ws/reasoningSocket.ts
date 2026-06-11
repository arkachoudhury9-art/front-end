"use client";

import { logClient } from "@/lib/client/log";
import {
  REASONING_WS_URL,
  USE_MOCK_REASONING_WEBSOCKET,
} from "@/lib/api/config";
import { getNextMockReasoningMessage } from "@/lib/mock/reasoningWebSocketMessages";
import type { ReasoningEvent } from "@/types/reasoning";

export type ReasoningSocketListener = (message: ReasoningEvent) => void;

const MOCK_INTERVAL_MS = 10000;
const MOCK_INITIAL_DELAY_MS = 5000;

function parseMessage(data: unknown): ReasoningEvent | null {
  try {
    if (typeof data !== "string") {
      return null;
    }

    const parsed = JSON.parse(data) as ReasoningEvent;

    if (
      typeof parsed.asset_id !== "string" ||
      !Array.isArray(parsed.selected_actions) ||
      typeof parsed.justification !== "string"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function emitMessage(
  onMessage: ReasoningSocketListener,
  message: ReasoningEvent,
  source: "mock" | "live",
): void {
  logClient("reasoning/events", `${source} message`, message);
  onMessage(message);
}

function createMockSocket(onMessage: ReasoningSocketListener): () => void {
  logClient("reasoning/events", "using mock WebSocket");

  const emit = () => {
    emitMessage(onMessage, getNextMockReasoningMessage(), "mock");
  };

  const initialTimeout = setTimeout(emit, MOCK_INITIAL_DELAY_MS);
  const intervalId = setInterval(emit, MOCK_INTERVAL_MS);

  return () => {
    clearTimeout(initialTimeout);
    clearInterval(intervalId);
  };
}

function createLiveSocket(onMessage: ReasoningSocketListener): () => void {
  let socket: WebSocket | null = null;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let closed = false;

  const connect = () => {
    if (closed) return;

    logClient("reasoning/events", "connecting", { url: REASONING_WS_URL });
    socket = new WebSocket(REASONING_WS_URL);

    socket.onopen = () => {
      logClient("reasoning/events", "connected");
    };

    socket.onmessage = (event) => {
      logClient("reasoning/events", "raw message", event.data);
      const message = parseMessage(event.data);
      if (message) {
        emitMessage(onMessage, message, "live");
      }
    };

    socket.onclose = () => {
      logClient("reasoning/events", "disconnected");
      if (!closed) {
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };

    socket.onerror = (error) => {
      logClient("reasoning/events", "error", error);
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

/** Client-only reasoning events WebSocket. */
export function connectReasoningSocket(
  onMessage: ReasoningSocketListener,
): () => void {
  if (USE_MOCK_REASONING_WEBSOCKET) {
    return createMockSocket(onMessage);
  }

  return createLiveSocket(onMessage);
}
