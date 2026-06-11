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

function createMockSocket(onMessage: ReasoningSocketListener): () => void {
  const initialTimeout = setTimeout(() => {
    onMessage(getNextMockReasoningMessage());
  }, MOCK_INITIAL_DELAY_MS);

  const intervalId = setInterval(() => {
    onMessage(getNextMockReasoningMessage());
  }, MOCK_INTERVAL_MS);

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

    socket = new WebSocket(REASONING_WS_URL);

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

export function connectReasoningSocket(
  onMessage: ReasoningSocketListener,
): () => void {
  if (USE_MOCK_REASONING_WEBSOCKET) {
    console.info("[reasoning/events] using mock WebSocket");
    return createMockSocket(onMessage);
  }

  console.info("[reasoning/events] connecting to", REASONING_WS_URL);
  return createLiveSocket(onMessage);
}
