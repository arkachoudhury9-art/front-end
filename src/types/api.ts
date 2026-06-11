export type AnomalySeverity =
  | "P1_CRITICAL"
  | "P2_HIGH"
  | "P3_MEDIUM"
  | "P4_LOW"
  | string;

export type StatisticalAnalytics = {
  previous_value: number;
  delta_percent: string;
  rolling_avg_24h: number;
  z_score: number;
  status: string;
  rate_of_change_per_min: number;
  anomaly_type: string;
  confidence_score: number;
};

export type ApiAnomaly = {
  id: number;
  sensor_name: string;
  verdict_summary: string | null;
  severity: AnomalySeverity;
  anomaly_type: string;
  session_id: string;
  asset_id: string;
  confidence: number;
  statistical_analytics: StatisticalAnalytics;
};

export type AnomalyHistResponse = {
  anomalies: ApiAnomaly[];
};
