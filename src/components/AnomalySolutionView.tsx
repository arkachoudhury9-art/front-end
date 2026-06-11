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
  }, []);

  useEffect(() => {
    return subscribeToAnomalies(syncAnomaly);
  }, [syncAnomaly]);

  if (loading) {
    return (
      <section className="flex flex-1 items-center justify-center rounded-xl border border-surface-border bg-surface-raised p-6 text-center">
        <div>
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="mt-3 text-xs text-slate-400">Loading anomaly details...</p>
        </div>
      </section>
    );
  }

  if (!anomaly) {
    return (
      <section className="flex flex-1 items-center justify-center rounded-xl border border-surface-border bg-surface-raised p-6 text-center text-sm text-slate-400">
        Anomaly not found.
      </section>
    );
  }

  return (
    <>
      {error && <ApiStatusBanner message={error} />}
      <div className="flex shrink-0 flex-wrap items-center gap-3 rounded-xl border border-surface-border bg-surface-raised px-4 py-2.5 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            Anomaly
          </span>
          <span className="font-mono text-sm font-semibold text-accent">
            {anomaly.id}
          </span>
        </div>
        <div className="h-4 w-px bg-surface-border" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            Asset
          </span>
          <span className="font-mono text-xs text-slate-200">
            {anomaly.assetId}
          </span>
        </div>
        <div className="h-4 w-px bg-surface-border" />
        <PriorityBadge
          priority={anomaly.priority}
          label={anomaly.severity}
          analytics={anomaly.statisticalAnalytics}
        />
        <p className="min-w-0 flex-1 truncate text-xs text-slate-400">
          {anomaly.reason}
        </p>
      </div>

      <AnomalySolution
        anomaly={anomaly}
        reasoningEvent={anomaly.reasoningEvent}
      />
    </>
  );
}
