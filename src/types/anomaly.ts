import type { StatisticalAnalytics } from "@/types/api";
import type { ReasoningEvent } from "@/types/reasoning";

export type AnomalyPriority = "critical" | "high" | "medium" | "low";

export type AnomalySource = "history" | "live";

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
  source: AnomalySource;
  verdict: string | null;
};

export function hasReasoningJustification(
  reasoningEvent?: ReasoningEvent,
): boolean {
  return Boolean(reasoningEvent?.justification?.trim());
}

/** Final verdict already recorded via anomaly_hist — no further review needed. */
export function hasHistoryVerdict(anomaly: Anomaly): boolean {
  return anomaly.source === "history" && Boolean(anomaly.verdict?.trim());
}

/** Review is immediate when anomaly is detected; otherwise requires reasoning justification. */
export function canReviewAnomaly(anomaly: Anomaly): boolean {
  if (hasHistoryVerdict(anomaly)) {
    return false;
  }

  if (anomaly.anomalyDetected) {
    return true;
  }

  return hasReasoningJustification(anomaly.reasoningEvent);
}

export function canViewAnomalySolution(anomaly: Anomaly): boolean {
  return canReviewAnomaly(anomaly) || hasHistoryVerdict(anomaly);
}

export type AnomalyDataSource = "api" | "mock";

export type AnomaliesResult = {
  anomalies: Anomaly[];
  error: string | null;
  source: AnomalyDataSource;
};
