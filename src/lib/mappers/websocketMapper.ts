import {
  formatAnomalyType,
  mapSeverityToPriority,
} from "@/lib/mappers/anomalyMapper";
import { coalesceStatisticalAnalytics } from "@/lib/mappers/safeDefaults";
import { upsertLiveAnomaly } from "@/lib/store/anomalyStore";
import type { Anomaly, AnomalyPriority, SolutionAction } from "@/types/anomaly";
import type { AnomalyWebSocketMessage } from "@/types/websocket";

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

function defaultSeverityForMessage(message: AnomalyWebSocketMessage): string {
  const status = message.sensor_status ?? "";

  if (status.includes("CRITICAL")) {
    return "P1_CRITICAL";
  }
  if (status.includes("HIGH")) {
    return "P2_HIGH";
  }
  if (status.includes("MODERATE")) {
    return "P3_MEDIUM";
  }
  return "P2_HIGH";
}

export function createAnomalyFromWebSocket(
  message: AnomalyWebSocketMessage,
): Anomaly {
  const severity = defaultSeverityForMessage(message);
  const priority = mapSeverityToPriority(severity);
  const assetId = message.asset_id ?? "unknown";
  const id = `live-${assetId}-${Date.now()}`;

  return {
    id,
    assetId,
    priority,
    severity,
    sensorName: "LIVE_SENSOR",
    sensorStatus: message.sensor_status ?? undefined,
    reason: formatAnomalyType(message.anomaly_type),
    confidence: message.confidence ?? 0,
    sessionId: "",
    statisticalAnalytics: coalesceStatisticalAnalytics(
      message.statistical_analytics,
      {
        status: message.sensor_status ?? "",
        rate_of_change_per_min: message.rate_of_change_per_min ?? 0,
        anomaly_type: message.anomaly_type ?? "",
        confidence_score: message.confidence ?? 0,
      },
    ),
    solutions: SOLUTIONS_BY_PRIORITY[priority],
    anomalyDetected: message.anomaly_detected ?? false,
    source: "live",
    verdict: null,
  };
}

/** Anomaly WebSocket adds newly detected anomalies to the table. */
export function appendLiveAnomalyFromWebSocket(
  anomalies: Anomaly[],
  message: AnomalyWebSocketMessage,
): Anomaly[] {
  if (!message.anomaly_detected) {
    return anomalies;
  }

  const newAnomaly = createAnomalyFromWebSocket(message);
  upsertLiveAnomaly(newAnomaly);

  return [newAnomaly, ...anomalies];
}
