import type { AnomalyWebSocketMessage } from "@/types/websocket";

const MOCK_MESSAGES: AnomalyWebSocketMessage[] = [
  {
    asset_id: "TRAIN_1-VEH_001-W1",
    statistical_analytics: {
      previous_value: 151.0,
      delta_percent: "-2.79%",
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
    asset_id: "TRAIN_2-VEH_014-W3",
    statistical_analytics: {
      previous_value: 2.45,
      delta_percent: "+1.20%",
      rolling_avg_24h: 2.89,
      z_score: 1.1,
    },
    sensor_status: "NORMAL",
    rate_of_change_per_min: 0.05,
    anomaly_detected: false,
    anomaly_type: "NONE",
    confidence: 0.95,
  },
  {
    asset_id: "TRAIN_1-VEH_008-W2",
    statistical_analytics: {
      previous_value: 98.4,
      delta_percent: "-12.50%",
      rolling_avg_24h: 104.5,
      z_score: 2.8,
    },
    sensor_status: "MODERATE_OUTLIER",
    rate_of_change_per_min: 0.18,
    anomaly_detected: true,
    anomaly_type: "THRESHOLD_BREACH",
    confidence: 0.72,
  },
  {
    asset_id: "AST1234",
    statistical_analytics: {
      previous_value: 151.0,
      delta_percent: "-2.79%",
      rolling_avg_24h: 177.62741935483874,
      z_score: 4.0,
    },
    sensor_status: "NORMAL",
    rate_of_change_per_min: 0.36,
    anomaly_detected: false,
    anomaly_type: "NONE",
    confidence: 0.9,
  },
];

let messageIndex = 0;

export function getNextMockWebSocketMessage(): AnomalyWebSocketMessage {
  const message = MOCK_MESSAGES[messageIndex % MOCK_MESSAGES.length];
  messageIndex += 1;
  return message;
}
