export type WsStatisticalAnalytics = {
  previous_value: number;
  delta_percent: string;
  rolling_avg_24h: number;
  z_score: number;
};

export type AnomalyWebSocketMessage = {
  asset_id: string;
  statistical_analytics: WsStatisticalAnalytics;
  sensor_status: string;
  rate_of_change_per_min: number;
  anomaly_detected: boolean;
  anomaly_type: string;
  confidence: number;
};
