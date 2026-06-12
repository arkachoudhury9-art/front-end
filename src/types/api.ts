export type AnomalySeverity =
  | "P1_CRITICAL"
  | "P2_HIGH"
  | "P3_MEDIUM"
  | "P4_LOW"
  | string;

export type StatisticalAnalytics = {
  previous_value?: number | null;
  delta_percent?: string | null;
  rolling_avg_24h?: number | null;
  z_score?: number | null;
  status?: string | null;
  rate_of_change_per_min?: number | null;
  anomaly_type?: string | null;
  confidence_score?: number | null;
};

/** Reasoning fields on anomaly_hist (flat on each anomaly, same shape as reasoning WebSocket). */
export type ApiReasoningFields = {
  selected_actions?: string[] | null;
  justification?: string | null;
  step_by_step_instructions?: string[] | null;
  sop_references?: string[] | null;
  severity_escalation_required?: boolean | null;
  estimated_resolution_time?: string | null;
};

export type ApiAnomaly = ApiReasoningFields & {
  id?: number | null;
  sensor_name?: string | null;
  verdict?: string | null;
  severity?: AnomalySeverity | null;
  anomaly_type?: string | null;
  session_id?: string | null;
  asset_id?: string | null;
  confidence?: number | null;
  statistical_analytics?: StatisticalAnalytics | null;
  /** From anomaly detection WebSocket shape */
  anomaly_detected?: boolean | null;
  sensor_status?: string | null;
};

export type AnomalyHistResponse = {
  anomalies?: ApiAnomaly[] | null;
};
