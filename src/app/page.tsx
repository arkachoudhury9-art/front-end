import { AnomalyList } from "@/components/AnomalyList";
import { AppShell } from "@/components/AppShell";
import { mockAnomalies } from "@/lib/mockAnomalies";

export default function HomePage() {
  return (
    <AppShell
      title="Anomaly Detection"
      subtitle="Monitor assets and initiate remediation workflows"
    >
      <AnomalyList anomalies={mockAnomalies} />
    </AppShell>
  );
}
