import type { ReasoningEvent } from "@/types/reasoning";

const STORAGE_PREFIX = "reasoning:";

const memoryStore = new Map<string, ReasoningEvent>();
const listeners = new Set<() => void>();

function storageKey(assetId: string): string {
  return `${STORAGE_PREFIX}${assetId}`;
}

function hydrateFromStorage(assetId: string): ReasoningEvent | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const raw = sessionStorage.getItem(storageKey(assetId));
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as ReasoningEvent;
  } catch {
    return undefined;
  }
}

export function setReasoningEvent(event: ReasoningEvent): void {
  memoryStore.set(event.asset_id, event);

  if (typeof window !== "undefined") {
    sessionStorage.setItem(storageKey(event.asset_id), JSON.stringify(event));
  }

  listeners.forEach((listener) => listener());
}

export function getReasoningEvent(assetId: string): ReasoningEvent | undefined {
  return memoryStore.get(assetId) ?? hydrateFromStorage(assetId);
}

export function subscribeToReasoningEvents(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
