import type { Anomaly } from "@/types/anomaly";

export const mockAnomalies: Anomaly[] = [
  {
    id: "ANM-1042",
    assetId: "CSR 00020",
    priority: "critical",
    reason: "High temperature",
    solutions: [
      { id: "deploy-field-agent", label: "Deploy Field Agent" },
    ],
  },
  {
    id: "ANM-1038",
    assetId: "CSR 00021",
    priority: "high",
    reason: "Low speed",
    solutions: [
      { id: "deploy-field-agent", label: "Deploy Field Agent" },
    ],
  },
  {
    id: "ANM-1031",
    assetId: "CSR 00022",
    priority: "medium",
    reason: "Low speed",
    solutions: [
      { id: "schedule-inspection", label: "Schedule Inspection" },
    ],
  },
  {
    id: "ANM-1025",
    assetId: "CSR 00023",
    priority: "low",
    reason: "High temperature",
    solutions: [
      { id: "monitor", label: "Continue Monitoring" },
    ],
  },
];

export function getAnomalyById(id: string): Anomaly | undefined {
  return mockAnomalies.find((a) => a.id === id);
}
