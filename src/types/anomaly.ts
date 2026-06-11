import type { StatisticalAnalytics } from "@/types/api";
import type { ReasoningEvent } from "@/types/reasoning";

export type AnomalyPriority = "critical" | "high" | "medium" | "low";

export type SolutionAction = {
  id: string;
  label: string;
};

export type Anomaly = {
  id: string;
  assetId: string;
  priority: AnomalyPriority;
  severity: string;
  sensorName: string;
  sensorStatus?: string;
  reason: string;
  confidence: number;
  sessionId: string;
  statisticalAnalytics: StatisticalAnalytics;
  solutions: SolutionAction[];
  anomalyDetected: boolean;
  reasoningEvent?: ReasoningEvent;
};

export function hasReasoningJustification(
  reasoningEvent?: ReasoningEvent,
): boolean {
  return Boolean(reasoningEvent?.justification?.trim());
}

/** Review is immediate when anomaly is detected; otherwise requires reasoning justification. */
export function canReviewAnomaly(anomaly: Anomaly): boolean {
  if (anomaly.anomalyDetected) {
    return true;
  }

  return hasReasoningJustification(anomaly.reasoningEvent);
}

export type AnomalyDataSource = "api" | "mock";

export type AnomaliesResult = {
  anomalies: Anomaly[];
  error: string | null;
  source: AnomalyDataSource;
};
