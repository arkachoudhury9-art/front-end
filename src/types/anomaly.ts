export type AnomalyPriority = "critical" | "high" | "medium" | "low";

export type SolutionAction = {
  id: string;
  label: string;
};

export type Anomaly = {
  id: string;
  assetId: string;
  priority: AnomalyPriority;
  reason: string;
  solutions: SolutionAction[];
};
