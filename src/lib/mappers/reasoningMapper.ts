import { normalizeReasoningEvent } from "@/lib/mappers/safeDefaults";
import { upsertLiveAnomaly } from "@/lib/store/anomalyStore";
import type { Anomaly } from "@/types/anomaly";
import type { ReasoningEvent } from "@/types/reasoning";

function applyReasoningToLiveAnomaly(
  anomaly: Anomaly,
  event: ReasoningEvent,
): Anomaly {
  const assetId = event.asset_id ?? "";

  if (anomaly.source !== "live" || !assetId || anomaly.assetId !== assetId) {
    return anomaly;
  }

  const reasoningEvent = normalizeReasoningEvent(event);
  if (!reasoningEvent) {
    return anomaly;
  }

  const updated = {
    ...anomaly,
    reasoningEvent,
  };

  upsertLiveAnomaly(updated);
  return updated;
}

/** Reasoning WebSocket updates only live-detected anomalies. */
export function applyReasoningToLiveAnomalies(
  anomalies: Anomaly[],
  event: ReasoningEvent,
): Anomaly[] {
  return anomalies.map((anomaly) =>
    applyReasoningToLiveAnomaly(anomaly, event),
  );
}
