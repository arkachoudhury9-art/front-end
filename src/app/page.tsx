import { AnomalyDashboard } from "@/components/AnomalyDashboard";
import { AppShell } from "@/components/AppShell";

export default function HomePage() {
  return (
    <AppShell
      title="PICA"
      subtitle="Monitor assets and initiate remediation workflows"
    >
      <AnomalyDashboard />
    </AppShell>
  );
}
