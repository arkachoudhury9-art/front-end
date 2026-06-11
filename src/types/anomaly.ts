import type { StatisticalAnalytics } from "@/types/api";

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
  reason: string;
  confidence: number;
  sessionId: string;
  statisticalAnalytics: StatisticalAnalytics;
  solutions: SolutionAction[];
};

export type AnomalyDataSource = "api" | "mock";

export type AnomaliesResult = {
  anomalies: Anomaly[];
  error: string | null;
  source: AnomalyDataSource;
};
