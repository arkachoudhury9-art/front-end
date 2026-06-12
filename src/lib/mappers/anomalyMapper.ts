import type { ApiAnomaly } from "@/types/api";
import type { Anomaly, AnomalyPriority, SolutionAction } from "@/types/anomaly";
import {
  coalesceStatisticalAnalytics,
  normalizeReasoningEvent,
} from "@/lib/mappers/safeDefaults";

const SEVERITY_TO_PRIORITY: Record<string, AnomalyPriority> = {
  P1_CRITICAL: "critical",
  P2_HIGH: "high",
  P3_MEDIUM: "medium",
  P4_LOW: "low",
};

const SOLUTIONS_BY_PRIORITY: Record<AnomalyPriority, SolutionAction[]> = {
  critical: [
    { id: "deploy-field-agent", label: "Deploy Field Agent" },
    { id: "run-diagnostics", label: "Run Remote Diagnostics" },
  ],
  high: [
    { id: "deploy-field-agent", label: "Deploy Field Agent" },
    { id: "schedule-inspection", label: "Schedule Inspection" },
  ],
  medium: [
    { id: "schedule-inspection", label: "Schedule Inspection" },
    { id: "adjust-setpoint", label: "Adjust Setpoint" },
  ],
  low: [{ id: "monitor", label: "Continue Monitoring" }],
};

export function formatAnomalyType(anomalyType?: string | null): string {
  if (!anomalyType || anomalyType === "NONE") {
    return "None";
  }

  return anomalyType
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function mapSeverityToPriority(severity?: string | null): AnomalyPriority {
  return SEVERITY_TO_PRIORITY[severity ?? ""] ?? "medium";
}

function mapApiReasoningToEvent(apiAnomaly: ApiAnomaly) {
  return normalizeReasoningEvent({
    asset_id: apiAnomaly.asset_id,
    session_id: apiAnomaly.session_id,
    justification: apiAnomaly.justification,
    selected_actions: apiAnomaly.selected_actions,
    step_by_step_instructions: apiAnomaly.step_by_step_instructions,
    sop_references: apiAnomaly.sop_references,
    severity_escalation_required: apiAnomaly.severity_escalation_required,
    estimated_resolution_time: apiAnomaly.estimated_resolution_time,
  });
}

export function mapApiAnomalyToUi(apiAnomaly: ApiAnomaly): Anomaly {
  const priority = mapSeverityToPriority(apiAnomaly.severity);

  return {
    id: String(apiAnomaly.id ?? ""),
    assetId: apiAnomaly.asset_id ?? "",
    priority,
    severity: apiAnomaly.severity ?? "",
    sensorName: apiAnomaly.sensor_name ?? "",
    sensorStatus: apiAnomaly.sensor_status ?? undefined,
    reason: formatAnomalyType(apiAnomaly.anomaly_type),
    confidence: apiAnomaly.confidence ?? 0,
    sessionId: apiAnomaly.session_id ?? "",
    statisticalAnalytics: coalesceStatisticalAnalytics(
      apiAnomaly.statistical_analytics,
      {
        anomaly_type: apiAnomaly.anomaly_type ?? "",
        confidence_score: apiAnomaly.confidence ?? 0,
        status: apiAnomaly.sensor_status ?? "",
      },
    ),
    solutions: SOLUTIONS_BY_PRIORITY[priority],
    anomalyDetected: apiAnomaly.anomaly_detected ?? false,
    reasoningEvent: mapApiReasoningToEvent(apiAnomaly),
    source: "history",
    verdict: apiAnomaly.verdict ?? null,
  };
}

export function mapApiAnomaliesToUi(apiAnomalies?: ApiAnomaly[] | null): Anomaly[] {
  return (apiAnomalies ?? []).map(mapApiAnomalyToUi);
}
