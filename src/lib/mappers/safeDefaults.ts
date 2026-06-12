import type { StatisticalAnalytics } from "@/types/api";
import type { ReasoningEvent } from "@/types/reasoning";

export const EMPTY_STATISTICAL_ANALYTICS: StatisticalAnalytics = {
  previous_value: 0,
  delta_percent: "—",
  rolling_avg_24h: 0,
  z_score: 0,
  status: "",
  rate_of_change_per_min: 0,
  anomaly_type: "",
  confidence_score: 0,
};

export function coalesceStatisticalAnalytics(
  analytics?: Partial<StatisticalAnalytics> | null,
  overrides?: Partial<StatisticalAnalytics>,
): StatisticalAnalytics {
  return {
    ...EMPTY_STATISTICAL_ANALYTICS,
    ...analytics,
    ...overrides,
  };
}

export function normalizeReasoningEvent(
  event?: Partial<ReasoningEvent> | null,
): ReasoningEvent | undefined {
  const justification = event?.justification?.trim();
  if (!justification) {
    return undefined;
  }

  return {
    asset_id: event?.asset_id ?? "",
    session_id: event?.session_id,
    justification,
    selected_actions: event?.selected_actions ?? [],
    step_by_step_instructions: event?.step_by_step_instructions ?? [],
    sop_references: event?.sop_references ?? [],
    severity_escalation_required: event?.severity_escalation_required ?? false,
    estimated_resolution_time: event?.estimated_resolution_time ?? undefined,
  };
}
