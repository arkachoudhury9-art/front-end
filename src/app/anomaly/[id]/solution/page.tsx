import { AnomalySolutionView } from "@/components/AnomalySolutionView";
import { AppShell } from "@/components/AppShell";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AnomalySolutionPage({ params }: PageProps) {
  const { id } = await params;
  const anomalyId = decodeURIComponent(id);

  return (
    <AppShell
      title="Anomaly Solution"
      subtitle={`Reviewing anomaly ${anomalyId}`}
      backHref="/"
      fillViewport
    >
      <AnomalySolutionView anomalyId={anomalyId} />
    </AppShell>
  );
}
