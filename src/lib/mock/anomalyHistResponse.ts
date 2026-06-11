import type { AnomalyHistResponse } from "@/types/api";

/** Mock payload matching GET /anomaly_hist response shape. */
export const mockAnomalyHistResponse: AnomalyHistResponse = {
  anomalies: [
    {
      id: 1,
      sensor_name: "TEMPERATURE",
      verdict_summary: null,
      severity: "P1_CRITICAL",
      anomaly_type:
        "CRITICAL_THRESHOLD_BREACH_AND_TREND_ESCALATION_AND_CRITICAL_STATISTICAL_ANOMALY",
      session_id: "815b93e9-a5c8-4b9b-bbca-e67faced3248",
      asset_id: "TRAIN_1-VEH_001-W1",
      confidence: 1.0,
      statistical_analytics: {
        previous_value: 15.54,
        delta_percent: "+164.15%",
        rolling_avg_24h: 34.071935483870966,
        z_score: 3.39,
        status: "CRITICAL_OUTLIER",
        rate_of_change_per_min: 1.24,
        anomaly_type:
          "CRITICAL_THRESHOLD_BREACH_AND_TREND_ESCALATION_AND_CRITICAL_STATISTICAL_ANOMALY",
        confidence_score: 1.0,
      },
    },
    {
      id: 2,
      sensor_name: "FORCE",
      verdict_summary: null,
      severity: "P1_CRITICAL",
      anomaly_type:
        "CRITICAL_THRESHOLD_BREACH_AND_TREND_ESCALATION_AND_CRITICAL_STATISTICAL_ANOMALY",
      session_id: "815b93e9-a5c8-4b9b-bbca-e67faced3248",
      asset_id: "TRAIN_1-VEH_001-W1",
      confidence: 1.0,
      statistical_analytics: {
        previous_value: 80.97315609097598,
        delta_percent: "+336.28%",
        rolling_avg_24h: 80.23801254972865,
        z_score: 4.86,
        status: "CRITICAL_OUTLIER",
        rate_of_change_per_min: 4.48,
        anomaly_type:
          "CRITICAL_THRESHOLD_BREACH_AND_TREND_ESCALATION_AND_CRITICAL_STATISTICAL_ANOMALY",
        confidence_score: 1.0,
      },
    },
    {
      id: 3,
      sensor_name: "VIBRATION",
      verdict_summary: null,
      severity: "P2_HIGH",
      anomaly_type: "TREND_ESCALATION_AND_STATISTICAL_ANOMALY",
      session_id: "a12c44f1-9b2e-4d10-8f31-2c9e6a7b4d01",
      asset_id: "TRAIN_2-VEH_014-W3",
      confidence: 0.87,
      statistical_analytics: {
        previous_value: 2.14,
        delta_percent: "+42.50%",
        rolling_avg_24h: 2.89,
        z_score: 2.71,
        status: "HIGH_OUTLIER",
        rate_of_change_per_min: 0.38,
        anomaly_type: "TREND_ESCALATION_AND_STATISTICAL_ANOMALY",
        confidence_score: 0.87,
      },
    },
    {
      id: 4,
      sensor_name: "PRESSURE",
      verdict_summary: null,
      severity: "P3_MEDIUM",
      anomaly_type: "THRESHOLD_BREACH",
      session_id: "f8e21b90-1c4a-4f6e-9d22-7b5a3c1e0f44",
      asset_id: "TRAIN_1-VEH_008-W2",
      confidence: 0.62,
      statistical_analytics: {
        previous_value: 101.2,
        delta_percent: "-8.30%",
        rolling_avg_24h: 104.5,
        z_score: 1.95,
        status: "MODERATE_OUTLIER",
        rate_of_change_per_min: 0.12,
        anomaly_type: "THRESHOLD_BREACH",
        confidence_score: 0.62,
      },
    },
  ],
};
