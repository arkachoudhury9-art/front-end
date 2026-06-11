import type { Anomaly } from "@/types/anomaly";
import type { ReasoningEvent } from "@/types/reasoning";

export function applyReasoningEvent(
  anomaly: Anomaly,
  event: ReasoningEvent,
): Anomaly {
  if (anomaly.assetId !== event.asset_id) {
    return anomaly;
  }

  return {
    ...anomaly,
    reasoningEvent: event,
  };
}

export function applyReasoningEvents(
  anomalies: Anomaly[],
  event: ReasoningEvent,
): Anomaly[] {
  return anomalies.map((anomaly) => applyReasoningEvent(anomaly, event));
}
