import type { Anomaly } from "@/types/anomaly";

type AnomalySolutionProps = {
  anomaly: Anomaly;
};

/**
 * Placeholder for anomaly review and resolution workflows.
 */
export function AnomalySolution({ anomaly }: AnomalySolutionProps) {
  return (
    <section className="rounded-xl border border-dashed border-surface-border bg-surface-raised/50 p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface ring-1 ring-surface-border">
        <svg
          className="h-8 w-8 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l4.655-5.653m3.634 1.88l3.634-1.88"
          />
        </svg>
      </div>
      <h2 className="mt-6 text-lg font-semibold text-white">Review workspace</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
        This area is reserved for reviewing and resolving anomaly{" "}
        <span className="font-mono text-slate-300">{anomaly.id}</span>.
      </p>
      <dl className="mx-auto mt-8 inline-grid grid-cols-2 gap-x-8 gap-y-2 rounded-lg border border-surface-border bg-surface px-8 py-4 text-left text-sm">
        <dt className="text-slate-500">Anomaly</dt>
        <dd className="font-mono text-accent">{anomaly.id}</dd>
        <dt className="text-slate-500">Asset</dt>
        <dd className="font-mono text-slate-300">{anomaly.assetId}</dd>
        <dt className="text-slate-500">Sensor</dt>
        <dd className="font-mono text-slate-300">{anomaly.sensorName}</dd>
        <dt className="text-slate-500">Solutions</dt>
        <dd className="text-slate-300">{anomaly.solutions.length}</dd>
      </dl>
    </section>
  );
}
