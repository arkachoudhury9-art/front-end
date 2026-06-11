import type { AnomalyWebSocketMessage } from "@/types/websocket";

/** Live detections for assets not yet in history — appended to the table. */
const MOCK_MESSAGES: AnomalyWebSocketMessage[] = [
  {
    asset_id: "AST1234",
    statistical_analytics: {
      previous_value: 151.0,
      delta_percent: "+18.40%",
      rolling_avg_24h: 177.63,
      z_score: 4.0,
    },
    sensor_status: "CRITICAL_OUTLIER",
    rate_of_change_per_min: 0.36,
    anomaly_detected: true,
    anomaly_type: "CRITICAL_THRESHOLD_BREACH",
    confidence: 0.9,
  },
  {
    asset_id: "AST5678",
    statistical_analytics: {
      previous_value: 62.5,
      delta_percent: "+22.10%",
      rolling_avg_24h: 58.2,
      z_score: 3.2,
    },
    sensor_status: "HIGH_OUTLIER",
    rate_of_change_per_min: 0.52,
    anomaly_detected: true,
    anomaly_type: "TREND_ESCALATION_AND_STATISTICAL_ANOMALY",
    confidence: 0.84,
  },
];

let messageIndex = 0;

export function getNextMockWebSocketMessage(): AnomalyWebSocketMessage {
  const message = MOCK_MESSAGES[messageIndex % MOCK_MESSAGES.length];
  messageIndex += 1;
  return message;
}
