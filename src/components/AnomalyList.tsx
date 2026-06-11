"use client";

import Link from "next/link";
import { PriorityBadge } from "@/components/PriorityBadge";
import type { Anomaly } from "@/types/anomaly";

type AnomalyListProps = {
  anomalies: Anomaly[];
  error?: string | null;
};

export function AnomalyList({
  anomalies = [],
  error,
}: AnomalyListProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-surface-border bg-surface-raised shadow-xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-white">Detected Anomalies</h2>
          <p className="mt-0.5 text-sm text-slate-400">
            {anomalies.length} active {anomalies.length === 1 ? "event" : "events"} requiring review
          </p>
        </div>
        <div className="flex gap-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-priority-critical" />
            Critical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-priority-high" />
            High
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-3">Anomaly ID</th>
              <th className="px-6 py-3">Asset ID</th>
              <th className="px-6 py-3">Priority</th>
              <th className="px-6 py-3">Reason</th>
              <th className="px-6 py-3">Solution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {anomalies.map((anomaly) => (
              <tr
                key={anomaly.id}
                className="transition hover:bg-surface/40"
              >
                <td className="whitespace-nowrap px-6 py-4 font-mono text-sm font-medium text-accent">
                  {anomaly.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-mono text-slate-300">
                  {anomaly.assetId}
                </td>
                <td className="px-6 py-4">
                  <PriorityBadge
                    priority={anomaly.priority}
                    label={anomaly.severity}
                    analytics={anomaly.statisticalAnalytics}
                  />
                </td>
                <td className="max-w-md px-6 py-4 text-slate-300">
                  {anomaly.reason}
                </td>
                <td className="px-6 py-4">
                  {anomaly.solutions.length > 0 ? (
                    <Link
                      href={`/anomaly/${encodeURIComponent(anomaly.id)}/solution`}
                      className="inline-flex rounded-lg border border-priority-low/40 bg-priority-low/15 px-3 py-1.5 text-xs font-semibold text-priority-low transition hover:border-priority-low hover:bg-priority-low/25 hover:text-white"
                    >
                      Review
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex cursor-not-allowed rounded-lg border border-surface-border bg-surface px-3 py-1.5 text-xs font-semibold text-slate-500 opacity-50"
                    >
                      Review
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {anomalies.length === 0 && (
        <div className="px-6 py-16 text-center text-slate-400">
          {error
            ? "Could not load anomalies. Check that the API is running and try again."
            : "No anomalies detected. All assets operating within normal parameters."}
        </div>
      )}
    </section>
  );
}
