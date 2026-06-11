import { upsertLiveAnomaly } from "@/lib/store/anomalyStore";
import type { Anomaly } from "@/types/anomaly";
import type { ReasoningEvent } from "@/types/reasoning";

function applyReasoningToLiveAnomaly(
  anomaly: Anomaly,
  event: ReasoningEvent,
): Anomaly {
  if (anomaly.source !== "live" || anomaly.assetId !== event.asset_id) {
    return anomaly;
  }

  const updated = {
    ...anomaly,
    reasoningEvent: event,
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
