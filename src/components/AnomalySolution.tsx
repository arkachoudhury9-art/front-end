"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateAnomalyEventClient } from "@/lib/api/anomalyClient";
import { hasHistoryVerdict, type Anomaly } from "@/types/anomaly";
import type { ReasoningEvent } from "@/types/reasoning";

function resolveSessionId(
  anomaly: Anomaly,
  reasoningEvent?: ReasoningEvent,
): string {
  return reasoningEvent?.session_id?.trim() || anomaly.sessionId?.trim() || "";
}

type AnomalySolutionProps = {
  anomaly: Anomaly;
  reasoningEvent?: ReasoningEvent;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
      {children}
    </p>
  );
}

function ReasoningBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface/50 p-4">
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

type ReviewFormProps = {
  comment: string;
  onCommentChange: (value: string) => void;
  submitting: boolean;
  submitError?: string | null;
  onAccept: () => void;
  onReject: () => void;
};

function ReadOnlyVerdict({ verdict }: { verdict: string }) {
  return (
    <section className="shrink-0 rounded-xl border border-surface-border bg-surface-raised p-5">
      <h2 className="text-base font-semibold text-white">Final Verdict</h2>
      <p className="mt-1 text-sm text-slate-400">
        This anomaly has already been reviewed. No further action is required.
      </p>
      <div className="mt-4 rounded-lg border border-surface-border bg-surface/50 px-4 py-3">
        <SectionLabel>Recorded Verdict</SectionLabel>
        <p className="mt-2 text-sm font-medium text-slate-200">{verdict}</p>
      </div>
    </section>
  );
}

function ReviewForm({
  comment,
  onCommentChange,
  submitting,
  submitError,
  onAccept,
  onReject,
}: ReviewFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="review-comment"
          className="text-[11px] font-semibold uppercase tracking-wider text-slate-500"
        >
          Your Comment
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Add notes or observations before accepting or rejecting..."
          rows={3}
          disabled={submitting}
          className="mt-2 w-full resize-none rounded-lg border border-surface-border bg-surface px-4 py-3 text-sm leading-relaxed text-slate-200 placeholder:text-slate-500 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 disabled:opacity-60"
        />
      </div>

      {submitError && (
        <p className="text-sm text-priority-critical">{submitError}</p>
      )}

      <div className="flex flex-wrap justify-end gap-3 border-t border-surface-border pt-4">
        <button
          type="button"
          onClick={onReject}
          disabled={submitting}
          className="rounded-lg border border-priority-critical/40 bg-priority-critical/15 px-5 py-2.5 text-sm font-semibold text-priority-critical transition hover:bg-priority-critical/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={onAccept}
          disabled={submitting}
          className="rounded-lg border border-priority-low/40 bg-priority-low/15 px-5 py-2.5 text-sm font-semibold text-priority-low transition hover:bg-priority-low/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Accept
        </button>
      </div>
    </div>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
        expanded ? "rotate-180" : ""
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ReasoningAccordion({
  reasoningEvent,
}: {
  reasoningEvent: ReasoningEvent;
}) {
  const [expanded, setExpanded] = useState(false);
  const actionPreview = (reasoningEvent.selected_actions ?? []).join(", ");

  return (
    <section className="shrink-0 rounded-xl border border-surface-border bg-surface-raised">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className="flex w-full items-start justify-between gap-4 p-5 text-left transition hover:bg-surface/40"
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-white">AI Reasoning</h2>
          <p className="mt-1 text-sm text-slate-400">
            {expanded
              ? "Review the recommended response before making your decision."
              : actionPreview || "Expand to review AI reasoning details."}
          </p>
        </div>
        <ChevronIcon expanded={expanded} />
      </button>

      {expanded && (
        <div className="border-t border-surface-border px-5 pb-5 pt-4">
          <ReasoningContent reasoningEvent={reasoningEvent} />
        </div>
      )}
    </section>
  );
}

function ReasoningContent({
  reasoningEvent,
}: {
  reasoningEvent: ReasoningEvent;
}) {
  return (
    <div className="space-y-4">
      <ReasoningBlock label="Recommended Actions">
        <div className="flex flex-wrap gap-2">
          {(reasoningEvent.selected_actions ?? []).map((action) => (
            <span
              key={action}
              className="rounded-full border border-accent/30 bg-accent-muted px-3 py-1 text-sm font-medium text-accent"
            >
              {action}
            </span>
          ))}
        </div>
      </ReasoningBlock>

      <ReasoningBlock label="Justification">
        <p className="text-sm leading-relaxed text-slate-300">
          {reasoningEvent.justification ?? ""}
        </p>
      </ReasoningBlock>

      <div className="grid gap-4 lg:grid-cols-2">
        <ReasoningBlock label="Step-by-step Instructions">
          <ol className="list-decimal space-y-2.5 pl-5 text-sm leading-relaxed text-slate-300">
            {(reasoningEvent.step_by_step_instructions ?? []).map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </ReasoningBlock>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-surface-border bg-surface/50 p-4">
              <SectionLabel>Est. Resolution</SectionLabel>
              <p className="mt-2 font-mono text-sm text-slate-200">
                {reasoningEvent.estimated_resolution_time ?? "—"}
              </p>
            </div>
            <div className="rounded-lg border border-surface-border bg-surface/50 p-4">
              <SectionLabel>Escalation Required</SectionLabel>
              <p
                className={`mt-2 text-sm font-semibold ${
                  reasoningEvent.severity_escalation_required === true
                    ? "text-priority-high"
                    : "text-priority-low"
                }`}
              >
                {reasoningEvent.severity_escalation_required === true
                  ? "Yes"
                  : "No"}
              </p>
            </div>
          </div>

          <ReasoningBlock label="SOP References">
            <ul className="space-y-2">
              {(reasoningEvent.sop_references ?? []).map((ref) => (
                <li
                  key={ref}
                  className="rounded-lg border border-surface-border bg-surface px-3 py-2.5 font-mono text-xs leading-snug text-slate-300"
                >
                  {ref}
                </li>
              ))}
            </ul>
          </ReasoningBlock>
        </div>
      </div>
    </div>
  );
}

export function AnomalySolution({
  anomaly,
  reasoningEvent,
}: AnomalySolutionProps) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isReadOnly = hasHistoryVerdict(anomaly);

  const handleDecision = async (type: "accepted" | "rejected") => {
    if (isReadOnly) {
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    try {
      await updateAnomalyEventClient({
        sessionId: resolveSessionId(anomaly, reasoningEvent),
        verdict: type,
      });
      router.push("/");
    } catch (error) {
      console.error("[client][anomaly/event/update] failed:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit your decision. Please try again.",
      );
      setSubmitting(false);
    }
  };

  if (!reasoningEvent) {
    if (anomaly.source === "live") {
      return (
        <section className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-surface-border bg-surface-raised/50 p-10 text-center">
          <div>
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <h2 className="mt-5 text-base font-semibold text-white">
              Awaiting AI reasoning
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
              PICA is analyzing anomaly{" "}
              <span className="font-mono text-slate-300">{anomaly.id}</span>
            </p>
          </div>
        </section>
      );
    }

    if (isReadOnly && anomaly.verdict) {
      return <ReadOnlyVerdict verdict={anomaly.verdict} />;
    }

    return (
      <section className="rounded-xl border border-surface-border bg-surface-raised p-6">
        <h2 className="text-base font-semibold text-white">Your Decision</h2>
        <p className="mt-2 text-sm text-slate-400">
          No reasoning details available for this anomaly.
        </p>
        <div className="mt-6">
          <ReviewForm
            comment={comment}
            onCommentChange={setComment}
            submitting={submitting}
            submitError={submitError}
            onAccept={() => handleDecision("accepted")}
            onReject={() => handleDecision("rejected")}
          />
        </div>
      </section>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <ReasoningAccordion reasoningEvent={reasoningEvent} />

      {isReadOnly && anomaly.verdict ? (
        <ReadOnlyVerdict verdict={anomaly.verdict} />
      ) : (
        <section className="shrink-0 rounded-xl border border-surface-border bg-surface-raised p-5">
          <h2 className="text-base font-semibold text-white">Your Decision</h2>
          <p className="mt-1 text-sm text-slate-400">
            Add an optional comment, then accept or reject the AI recommendation.
          </p>
          <div className="mt-5">
            <ReviewForm
              comment={comment}
              onCommentChange={setComment}
              submitting={submitting}
              submitError={submitError}
              onAccept={() => handleDecision("accepted")}
              onReject={() => handleDecision("rejected")}
            />
          </div>
        </section>
      )}
    </div>
  );
}
