"use client";

import { useRef, useState } from "react";
import type { StatisticalAnalytics } from "@/types/api";
import type { AnomalyPriority } from "@/types/anomaly";

const styles: Record<AnomalyPriority, string> = {
  critical:
    "bg-priority-critical/15 text-priority-critical ring-priority-critical/40",
  high: "bg-priority-high/15 text-priority-high ring-priority-high/40",
  medium:
    "bg-priority-medium/15 text-priority-medium ring-priority-medium/40",
  low: "bg-priority-low/15 text-priority-low ring-priority-low/40",
};

type PriorityBadgeProps = {
  priority: AnomalyPriority;
  label?: string;
  analytics?: StatisticalAnalytics;
};

function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function AnalyticsTooltipContent({
  analytics,
}: {
  analytics: StatisticalAnalytics;
}) {
  const metrics = [
    { label: "Previous value", value: formatNumber(analytics.previous_value) },
    { label: "Delta", value: analytics.delta_percent, highlight: true },
    { label: "Rolling avg (24h)", value: formatNumber(analytics.rolling_avg_24h) },
    { label: "Z-score", value: formatNumber(analytics.z_score), highlight: true },
    { label: "Status", value: formatStatus(analytics.status) },
    {
      label: "Rate of change",
      value: `${formatNumber(analytics.rate_of_change_per_min)}/min`,
    },
    {
      label: "Confidence",
      value: `${Math.round(analytics.confidence_score * 100)}%`,
    },
  ];

  return (
    <div className="w-72 rounded-xl border border-surface-border bg-surface-raised p-4 shadow-2xl shadow-black/50">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Statistical Analytics
      </p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        {metrics.map((metric) => (
          <div key={metric.label} className="contents">
            <dt className="text-xs text-slate-500">{metric.label}</dt>
            <dd
              className={`text-right font-mono text-xs ${
                metric.highlight ? "font-semibold text-accent" : "text-slate-200"
              }`}
            >
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function PriorityBadge({ priority, label, analytics }: PriorityBadgeProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [tooltip, setTooltip] = useState<{ top: number; left: number } | null>(
    null,
  );

  const badge = (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${styles[priority]} ${
        analytics ? "cursor-help" : ""
      }`}
    >
      {label ?? priority}
    </span>
  );

  if (!analytics) {
    return badge;
  }

  const showTooltip = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setTooltip({
      top: rect.bottom + 10,
      left: rect.left + rect.width / 2,
    });
  };

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={showTooltip}
        onMouseLeave={() => setTooltip(null)}
        onFocus={showTooltip}
        onBlur={() => setTooltip(null)}
        tabIndex={0}
        aria-describedby={tooltip ? "analytics-tooltip" : undefined}
      >
        {badge}
      </span>

      {tooltip && (
        <div
          id="analytics-tooltip"
          role="tooltip"
          className="pointer-events-none fixed z-50 -translate-x-1/2"
          style={{ top: tooltip.top, left: tooltip.left }}
        >
          <div className="relative">
            <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-surface-border bg-surface-raised" />
            <AnalyticsTooltipContent analytics={analytics} />
          </div>
        </div>
      )}
    </>
  );
}
