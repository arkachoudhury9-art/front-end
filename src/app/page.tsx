import { AnomalyList } from "@/components/AnomalyList";
import { ApiStatusBanner } from "@/components/ApiStatusBanner";
import { AppShell } from "@/components/AppShell";
import { getAnomalies } from "@/lib/api/anomalies";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { anomalies, error } = await getAnomalies();

  return (
    <AppShell
      title="PICA"
      subtitle="Monitor assets and initiate remediation workflows"
    >
      {error && <ApiStatusBanner message={error} />}
      <AnomalyList anomalies={anomalies} error={error} />
    </AppShell>
  );
}
