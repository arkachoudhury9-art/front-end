import { formatAnomalyType } from "@/lib/mappers/anomalyMapper";
import type { Anomaly } from "@/types/anomaly";
import type { AnomalyWebSocketMessage } from "@/types/websocket";

export function applyWebSocketUpdate(
  anomaly: Anomaly,
  message: AnomalyWebSocketMessage,
): Anomaly {
  if (anomaly.assetId !== message.asset_id) {
    return anomaly;
  }

  return {
    ...anomaly,
    anomalyDetected: message.anomaly_detected,
    confidence: message.confidence,
    sensorStatus: message.sensor_status,
    reason:
      message.anomaly_type === "NONE"
        ? anomaly.reason
        : formatAnomalyType(message.anomaly_type),
    statisticalAnalytics: {
      ...anomaly.statisticalAnalytics,
      previous_value: message.statistical_analytics.previous_value,
      delta_percent: message.statistical_analytics.delta_percent,
      rolling_avg_24h: message.statistical_analytics.rolling_avg_24h,
      z_score: message.statistical_analytics.z_score,
      rate_of_change_per_min: message.rate_of_change_per_min,
      anomaly_type: message.anomaly_type,
      confidence_score: message.confidence,
      status: message.sensor_status,
    },
  };
}

export function applyWebSocketUpdates(
  anomalies: Anomaly[],
  message: AnomalyWebSocketMessage,
): Anomaly[] {
  return anomalies.map((anomaly) => applyWebSocketUpdate(anomaly, message));
}
