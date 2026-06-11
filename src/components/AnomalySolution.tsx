"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Anomaly } from "@/types/anomaly";
import type { ReasoningEvent } from "@/types/reasoning";

type AnomalySolutionProps = {
  anomaly: Anomaly;
  reasoningEvent?: ReasoningEvent;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </p>
  );
}

export function AnomalySolution({
  anomaly,
  reasoningEvent,
}: AnomalySolutionProps) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleDecision = (type: "accepted" | "rejected") => {
    setSubmitting(true);
    console.log(`[client][review] ${type}`, {
      anomalyId: anomaly.id,
      assetId: anomaly.assetId,
      comment,
      reasoningEvent,
    });
    router.push("/");
  };

  if (!reasoningEvent) {
    return (
      <section className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-surface-border bg-surface-raised/50 p-6 text-center">
        <div>
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <h2 className="mt-4 text-sm font-semibold text-white">
            Awaiting AI reasoning
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400">
            PICA is analyzing{" "}
            <span className="font-mono text-slate-300">{anomaly.id}</span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <section className="rounded-xl border border-surface-border bg-surface-raised p-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-white">AI Reasoning</h2>
          <span className="font-mono text-xs text-slate-400">
            {anomaly.assetId}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-3 lg:items-start">
          <div className="space-y-1.5">
            <div>
              <SectionLabel>Selected Action</SectionLabel>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {reasoningEvent.selected_actions.map((action) => (
                  <span
                    key={action}
                    className="rounded border border-accent/30 bg-accent-muted px-2 py-0.5 text-xs font-medium text-accent"
                  >
                    {action}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Justification</SectionLabel>
              <p className="mt-0.5 text-xs leading-snug text-slate-300">
                {reasoningEvent.justification}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <SectionLabel>Est. Resolution</SectionLabel>
                <p className="mt-0.5 font-mono text-xs text-slate-200">
                  {reasoningEvent.estimated_resolution_time}
                </p>
              </div>
              <div>
                <SectionLabel>Escalation</SectionLabel>
                <p
                  className={`mt-0.5 text-xs font-semibold ${
                    reasoningEvent.severity_escalation_required
                      ? "text-priority-high"
                      : "text-priority-low"
                  }`}
                >
                  {reasoningEvent.severity_escalation_required ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>Step-by-step Instructions</SectionLabel>
            <ol className="mt-1 list-decimal space-y-1 pl-4 text-xs leading-snug text-slate-300">
              {reasoningEvent.step_by_step_instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div>
            <SectionLabel>SOP References</SectionLabel>
            <ul className="mt-1 space-y-1 text-xs text-slate-300">
              {reasoningEvent.sop_references.map((ref) => (
                <li
                  key={ref}
                  className="truncate rounded border border-surface-border bg-surface px-2 py-1 font-mono text-[10px]"
                  title={ref}
                >
                  {ref}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-surface-border bg-surface-raised p-3">
        <label
          htmlFor="review-comment"
          className="text-[10px] font-semibold uppercase tracking-wider text-slate-500"
        >
          Your Comment
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add notes or observations..."
          rows={2}
          disabled={submitting}
          className="mt-1 w-full resize-none rounded-lg border border-surface-border bg-surface px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 disabled:opacity-60"
        />

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => handleDecision("accepted")}
            disabled={submitting}
            className="rounded-lg border border-priority-low/40 bg-priority-low/15 px-4 py-2 text-xs font-semibold text-priority-low transition hover:bg-priority-low/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => handleDecision("rejected")}
            disabled={submitting}
            className="rounded-lg border border-priority-critical/40 bg-priority-critical/15 px-4 py-2 text-xs font-semibold text-priority-critical transition hover:bg-priority-critical/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reject
          </button>
        </div>
      </section>
    </div>
  );
}
