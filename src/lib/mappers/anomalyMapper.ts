import type { ApiAnomaly } from "@/types/api";
import type { Anomaly, AnomalyPriority, SolutionAction } from "@/types/anomaly";

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
  return anomalyType
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function mapSeverityToPriority(severity: string): AnomalyPriority {
  return SEVERITY_TO_PRIORITY[severity] ?? "medium";
}

export function mapApiAnomalyToUi(apiAnomaly: ApiAnomaly): Anomaly {
  const priority = mapSeverityToPriority(apiAnomaly.severity);

  return {
    id: String(apiAnomaly.id),
    assetId: apiAnomaly.asset_id,
    priority,
    severity: apiAnomaly.severity,
    sensorName: apiAnomaly.sensor_name,
    reason: formatAnomalyType(apiAnomaly.anomaly_type),
    confidence: apiAnomaly.confidence,
    sessionId: apiAnomaly.session_id,
    statisticalAnalytics: apiAnomaly.statistical_analytics,
    solutions: SOLUTIONS_BY_PRIORITY[priority],
    anomalyDetected: true,
  };
}

export function mapApiAnomaliesToUi(apiAnomalies: ApiAnomaly[]): Anomaly[] {
  return apiAnomalies.map(mapApiAnomalyToUi);
}
