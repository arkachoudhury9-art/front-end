import { AnomalySolution } from "@/components/AnomalySolution";
import { AppShell } from "@/components/AppShell";
import { PriorityBadge } from "@/components/PriorityBadge";
import { getAnomalyById } from "@/lib/mockAnomalies";
import { notFound } from "next/navigation";

const SOLUTION_LABELS: Record<string, string> = {
  "deploy-field-agent": "Deploy Field Agent",
  "schedule-inspection": "Schedule Inspection",
  "run-diagnostics": "Run Remote Diagnostics",
  "adjust-setpoint": "Adjust Setpoint",
  monitor: "Continue Monitoring",
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ solution?: string }>;
};

export default async function AnomalySolutionPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { solution: solutionId = "" } = await searchParams;

  const anomaly = getAnomalyById(decodeURIComponent(id));
  if (!anomaly) {
    notFound();
  }

  const matchedSolution = anomaly.solutions.find((s) => s.id === solutionId);
  const solutionLabel =
    matchedSolution?.label ??
    SOLUTION_LABELS[solutionId] ??
    solutionId.replace(/-/g, " ");

  return (
    <AppShell
      title="Anomaly Solution"
      subtitle={`Resolving ${anomaly.id} · ${anomaly.assetId}`}
      backHref="/"
    >
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
        <PriorityBadge priority={anomaly.priority} />
        <p className="w-full text-sm text-slate-400 sm:w-auto sm:flex-1">
          {anomaly.reason}
        </p>
      </div>

      <AnomalySolution
        anomalyId={anomaly.id}
        solutionId={solutionId}
        solutionLabel={solutionLabel}
      />
    </AppShell>
  );
}
