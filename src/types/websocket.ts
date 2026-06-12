export type WsStatisticalAnalytics = {
  previous_value?: number | null;
  delta_percent?: string | null;
  rolling_avg_24h?: number | null;
  z_score?: number | null;
};

export type AnomalyWebSocketMessage = {
  asset_id?: string | null;
  statistical_analytics?: WsStatisticalAnalytics | null;
  sensor_status?: string | null;
  rate_of_change_per_min?: number | null;
  anomaly_detected?: boolean | null;
  anomaly_type?: string | null;
  confidence?: number | null;
};
