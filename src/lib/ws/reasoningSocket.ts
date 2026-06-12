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

    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      asset_id: parsed.asset_id ?? "",
      session_id: parsed.session_id,
      selected_actions: parsed.selected_actions ?? [],
      justification: parsed.justification ?? "",
      step_by_step_instructions: parsed.step_by_step_instructions ?? [],
      sop_references: parsed.sop_references ?? [],
      severity_escalation_required: parsed.severity_escalation_required ?? false,
      estimated_resolution_time: parsed.estimated_resolution_time,
    };
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
