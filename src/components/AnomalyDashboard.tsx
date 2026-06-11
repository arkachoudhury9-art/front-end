"use client";

import { useCallback, useEffect, useState } from "react";
import { AnomalyList } from "@/components/AnomalyList";
import { ApiStatusBanner } from "@/components/ApiStatusBanner";
import { fetchAnomaliesClient } from "@/lib/api/anomalyClient";
import { applyReasoningEvents } from "@/lib/mappers/reasoningMapper";
import { applyWebSocketUpdates } from "@/lib/mappers/websocketMapper";
import {
  getReasoningEvent,
  setReasoningEvent,
} from "@/lib/store/reasoningEventStore";
import { connectAnomalySocket } from "@/lib/ws/anomalySocket";
import { connectReasoningSocket } from "@/lib/ws/reasoningSocket";
import type { Anomaly } from "@/types/anomaly";
import type { ReasoningEvent } from "@/types/reasoning";
import type { AnomalyWebSocketMessage } from "@/types/websocket";

export function AnomalyDashboard() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedAssetIds, setUpdatedAssetIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    let cancelled = false;

    fetchAnomaliesClient().then((result) => {
      if (cancelled) return;

      const hydrated = result.anomalies.map((anomaly) => {
        const reasoningEvent = getReasoningEvent(anomaly.assetId);
        return reasoningEvent
          ? { ...anomaly, reasoningEvent }
          : anomaly;
      });

      setAnomalies(hydrated);
      setError(result.error);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleWebSocketMessage = useCallback(
    (message: AnomalyWebSocketMessage) => {
      setAnomalies((current) => applyWebSocketUpdates(current, message));
      setUpdatedAssetIds((current) => new Set(current).add(message.asset_id));

      setTimeout(() => {
        setUpdatedAssetIds((current) => {
          const next = new Set(current);
          next.delete(message.asset_id);
          return next;
        });
      }, 2000);
    },
    [],
  );

  const handleReasoningMessage = useCallback((message: ReasoningEvent) => {
    setReasoningEvent(message);
    setAnomalies((current) => applyReasoningEvents(current, message));
    setUpdatedAssetIds((current) => new Set(current).add(message.asset_id));

    setTimeout(() => {
      setUpdatedAssetIds((current) => {
        const next = new Set(current);
        next.delete(message.asset_id);
        return next;
      });
    }, 2000);
  }, []);

  useEffect(() => {
    const disconnectAnomaly = connectAnomalySocket(handleWebSocketMessage);
    const disconnectReasoning = connectReasoningSocket(handleReasoningMessage);
    return () => {
      disconnectAnomaly();
      disconnectReasoning();
    };
  }, [handleWebSocketMessage, handleReasoningMessage]);

  if (loading) {
    return (
      <section className="overflow-hidden rounded-xl border border-surface-border bg-surface-raised p-12 text-center shadow-xl shadow-black/20">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="mt-4 text-sm text-slate-400">Loading anomalies...</p>
      </section>
    );
  }

  return (
    <>
      {error && <ApiStatusBanner message={error} />}
      <AnomalyList
        anomalies={anomalies}
        error={error}
        updatedAssetIds={updatedAssetIds}
      />
    </>
  );
}
