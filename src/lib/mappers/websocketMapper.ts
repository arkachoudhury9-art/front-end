import {
  formatAnomalyType,
  mapSeverityToPriority,
} from "@/lib/mappers/anomalyMapper";
import type { SolutionAction } from "@/types/anomaly";
import type { AnomalyPriority } from "@/types/anomaly";

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
import { upsertLiveAnomaly } from "@/lib/store/anomalyStore";
import type { Anomaly } from "@/types/anomaly";
import type { AnomalyWebSocketMessage } from "@/types/websocket";

function defaultSeverityForMessage(message: AnomalyWebSocketMessage): string {
  if (message.sensor_status.includes("CRITICAL")) {
    return "P1_CRITICAL";
  }
  if (message.sensor_status.includes("HIGH")) {
    return "P2_HIGH";
  }
  if (message.sensor_status.includes("MODERATE")) {
    return "P3_MEDIUM";
  }
  return "P2_HIGH";
}

export function createAnomalyFromWebSocket(
  message: AnomalyWebSocketMessage,
): Anomaly {
  const severity = defaultSeverityForMessage(message);
  const priority = mapSeverityToPriority(severity);
  const id = `live-${message.asset_id}-${Date.now()}`;

  return {
    id,
    assetId: message.asset_id,
    priority,
    severity,
    sensorName: "LIVE_SENSOR",
    sensorStatus: message.sensor_status,
    reason: formatAnomalyType(message.anomaly_type),
    confidence: message.confidence,
    sessionId: "",
    statisticalAnalytics: {
      previous_value: message.statistical_analytics.previous_value,
      delta_percent: message.statistical_analytics.delta_percent,
      rolling_avg_24h: message.statistical_analytics.rolling_avg_24h,
      z_score: message.statistical_analytics.z_score,
      status: message.sensor_status,
      rate_of_change_per_min: message.rate_of_change_per_min,
      anomaly_type: message.anomaly_type,
      confidence_score: message.confidence,
    },
    solutions: SOLUTIONS_BY_PRIORITY[priority],
    anomalyDetected: message.anomaly_detected,
    source: "live",
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
