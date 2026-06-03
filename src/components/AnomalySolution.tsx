type AnomalySolutionProps = {
  anomalyId: string;
  solutionId: string;
  solutionLabel: string;
};

/**
 * Placeholder for anomaly resolution workflows.
 * Wire up deployment, diagnostics, and remediation flows here.
 */
export function AnomalySolution({
  anomalyId,
  solutionId,
  solutionLabel,
}: AnomalySolutionProps) {
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
      <h2 className="mt-6 text-lg font-semibold text-white">Solution workspace</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
        This area is reserved for the selected remediation workflow. Implementation
        details for <span className="text-slate-300">{solutionLabel}</span> will
        appear here.
      </p>
      <dl className="mx-auto mt-8 inline-grid grid-cols-2 gap-x-8 gap-y-2 rounded-lg border border-surface-border bg-surface px-8 py-4 text-left text-sm">
        <dt className="text-slate-500">Anomaly</dt>
        <dd className="font-mono text-accent">{anomalyId}</dd>
        <dt className="text-slate-500">Action</dt>
        <dd className="font-mono text-slate-300">{solutionId}</dd>
      </dl>
    </section>
  );
}
