import type { ApiAnomaly, ApiReasoning } from "@/types/api";
import type { Anomaly, AnomalyPriority, SolutionAction } from "@/types/anomaly";
import type { ReasoningEvent } from "@/types/reasoning";

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

export function formatAnomalyType(anomalyType: string): string {
  if (anomalyType === "NONE") {
    return "None";
  }

  return anomalyType
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function mapSeverityToPriority(severity: string): AnomalyPriority {
  return SEVERITY_TO_PRIORITY[severity] ?? "medium";
}

function mapApiReasoningToEvent(
  assetId: string,
  reasoning: ApiReasoning,
): ReasoningEvent | undefined {
  if (!reasoning) {
    return undefined;
  }

  return {
    asset_id: assetId,
    ...reasoning,
  };
}

export function mapApiAnomalyToUi(apiAnomaly: ApiAnomaly): Anomaly {
  const priority = mapSeverityToPriority(apiAnomaly.severity);

  return {
    id: String(apiAnomaly.id),
    assetId: apiAnomaly.asset_id,
    priority,
    severity: apiAnomaly.severity,
    sensorName: apiAnomaly.sensor_name,
    sensorStatus: apiAnomaly.sensor_status,
    reason: formatAnomalyType(apiAnomaly.anomaly_type),
    confidence: apiAnomaly.confidence,
    sessionId: apiAnomaly.session_id,
    statisticalAnalytics: apiAnomaly.statistical_analytics,
    solutions: SOLUTIONS_BY_PRIORITY[priority],
    anomalyDetected: apiAnomaly.anomaly_detected,
    reasoningEvent: mapApiReasoningToEvent(
      apiAnomaly.asset_id,
      apiAnomaly.reasoning,
    ),
    source: "history",
  };
}

export function mapApiAnomaliesToUi(apiAnomalies: ApiAnomaly[]): Anomaly[] {
  return apiAnomalies.map(mapApiAnomalyToUi);
}
