import { AnomalySolution } from "@/components/AnomalySolution";
import { ApiStatusBanner } from "@/components/ApiStatusBanner";
import { AppShell } from "@/components/AppShell";
import { PriorityBadge } from "@/components/PriorityBadge";
import { getAnomalyById } from "@/lib/api/anomalies";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AnomalySolutionPage({ params }: PageProps) {
  const { id } = await params;

  const { anomaly, error } = await getAnomalyById(decodeURIComponent(id));
  if (!anomaly) {
    notFound();
  }

  return (
    <AppShell
      title="Anomaly Solution"
      subtitle={`Reviewing ${anomaly.id} · ${anomaly.assetId}`}
      backHref="/"
    >
      {error && <ApiStatusBanner message={error} />}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-surface-border bg-surface-raised px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Anomaly
          </p>
          <p className="font-mono text-lg font-semibold text-accent">
            {anomaly.id}
          </p>
        </div>
        <div className="h-8 w-px bg-surface-border" />
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Asset
          </p>
          <p className="font-mono text-slate-200">{anomaly.assetId}</p>
        </div>
        <div className="h-8 w-px bg-surface-border" />
        <PriorityBadge
          priority={anomaly.priority}
          label={anomaly.severity}
        />
        <p className="w-full text-sm text-slate-400 sm:w-auto sm:flex-1">
          {anomaly.reason}
        </p>
      </div>

      <AnomalySolution anomaly={anomaly} />
    </AppShell>
  );
}
