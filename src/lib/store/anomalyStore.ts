import type { Anomaly } from "@/types/anomaly";

const STORAGE_PREFIX = "anomaly:";

const memoryStore = new Map<string, Anomaly>();
const listeners = new Set<() => void>();

function storageKey(id: string): string {
  return `${STORAGE_PREFIX}${id}`;
}

function hydrateFromStorage(id: string): Anomaly | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const raw = sessionStorage.getItem(storageKey(id));
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as Anomaly;
  } catch {
    return undefined;
  }
}

export function upsertLiveAnomaly(anomaly: Anomaly): void {
  memoryStore.set(anomaly.id, anomaly);

  if (typeof window !== "undefined") {
    sessionStorage.setItem(storageKey(anomaly.id), JSON.stringify(anomaly));
  }

  listeners.forEach((listener) => listener());
}

export function getLiveAnomalyById(id: string): Anomaly | undefined {
  return memoryStore.get(id) ?? hydrateFromStorage(id);
}

export function subscribeToAnomalies(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
