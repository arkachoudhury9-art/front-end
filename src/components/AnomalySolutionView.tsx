"use client";

import { useCallback, useEffect, useState } from "react";
import { AnomalySolution } from "@/components/AnomalySolution";
import { ApiStatusBanner } from "@/components/ApiStatusBanner";
import { PriorityBadge } from "@/components/PriorityBadge";
import { fetchAnomalyByIdClient } from "@/lib/api/anomalyClient";
import { applyReasoningToLiveAnomalies } from "@/lib/mappers/reasoningMapper";
import { getLiveAnomalyById, subscribeToAnomalies } from "@/lib/store/anomalyStore";
import { setReasoningEvent } from "@/lib/store/reasoningEventStore";
import { connectReasoningSocket } from "@/lib/ws/reasoningSocket";
import type { Anomaly } from "@/types/anomaly";

type AnomalySolutionViewProps = {
  anomalyId: string;
};

function MetaItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <div>{children}</div>
    </div>
  );
}

export function AnomalySolutionView({ anomalyId }: AnomalySolutionViewProps) {
  const [anomaly, setAnomaly] = useState<Anomaly | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const syncAnomaly = useCallback(() => {
    const live = getLiveAnomalyById(anomalyId);
    if (live) {
      setAnomaly(live);
    }
  }, [anomalyId]);

  useEffect(() => {
    let cancelled = false;

    fetchAnomalyByIdClient(anomalyId).then((result) => {
      if (cancelled) return;
      setAnomaly(result.anomaly);
      setError(result.error);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [anomalyId]);

  useEffect(() => {
    if (anomaly?.source !== "live") {
      return;
    }

    const disconnect = connectReasoningSocket((message) => {
      setReasoningEvent(message);
      setAnomaly((current) => {
        if (!current || current.source !== "live") {
          return current;
        }

        const [updated] = applyReasoningToLiveAnomalies([current], message);
        return updated;
      });
    });

    return disconnect;
  }, [anomaly?.source]);

  useEffect(() => {
    return subscribeToAnomalies(syncAnomaly);
  }, [syncAnomaly]);

  if (loading) {
    return (
      <section className="flex flex-1 items-center justify-center rounded-xl border border-surface-border bg-surface-raised p-10 text-center">
        <div>
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="mt-4 text-sm text-slate-400">Loading anomaly details...</p>
        </div>
      </section>
    );
  }

  if (!anomaly) {
    return (
      <section className="flex flex-1 items-center justify-center rounded-xl border border-surface-border bg-surface-raised p-10 text-center text-sm text-slate-400">
        Anomaly not found.
      </section>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto">
      {error && <ApiStatusBanner message={error} />}

      <section className="shrink-0 rounded-xl border border-surface-border bg-surface-raised p-5">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetaItem label="Anomaly ID">
            <span className="font-mono text-base font-semibold text-accent">
              {anomaly.id ?? ""}
            </span>
          </MetaItem>
          <MetaItem label="Asset ID">
            <span className="font-mono text-sm text-slate-200">
              {anomaly.assetId ?? ""}
            </span>
          </MetaItem>
          <MetaItem label="Priority">
            <PriorityBadge
              priority={anomaly.priority}
              label={anomaly.severity ?? anomaly.priority}
              analytics={anomaly.statisticalAnalytics}
            />
          </MetaItem>
          <MetaItem label="Sensor">
            <span className="text-sm text-slate-200">
              {anomaly.sensorName ?? ""}
            </span>
          </MetaItem>
        </div>

        <div className="mt-5 border-t border-surface-border pt-5">
          <MetaItem label="Detected Reason">
            <p className="text-sm leading-relaxed text-slate-300">
              {anomaly.reason ?? ""}
            </p>
          </MetaItem>
        </div>
      </section>

      <AnomalySolution
        anomaly={anomaly}
        reasoningEvent={anomaly.reasoningEvent}
      />
    </div>
  );
}
