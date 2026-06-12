"use client";

import { useCallback, useEffect, useState } from "react";
import { AnomalyList } from "@/components/AnomalyList";
import { ApiStatusBanner } from "@/components/ApiStatusBanner";
import { fetchAnomaliesClient } from "@/lib/api/anomalyClient";
import { applyReasoningToLiveAnomalies } from "@/lib/mappers/reasoningMapper";
import { appendLiveAnomalyFromWebSocket } from "@/lib/mappers/websocketMapper";
import { setReasoningEvent } from "@/lib/store/reasoningEventStore";
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
      setAnomalies(result.anomalies);
      setError(result.error);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const flashUpdatedRow = useCallback((assetId: string) => {
    setUpdatedAssetIds((current) => new Set(current).add(assetId));

    setTimeout(() => {
      setUpdatedAssetIds((current) => {
        const next = new Set(current);
        next.delete(assetId);
        return next;
      });
    }, 2000);
  }, []);

  const handleWebSocketMessage = useCallback(
    (message: AnomalyWebSocketMessage) => {
      setAnomalies((current) =>
        appendLiveAnomalyFromWebSocket(current, message),
      );
      flashUpdatedRow(message.asset_id ?? "");
    },
    [flashUpdatedRow],
  );

  const handleReasoningMessage = useCallback(
    (message: ReasoningEvent) => {
      setReasoningEvent(message);
      setAnomalies((current) =>
        applyReasoningToLiveAnomalies(current, message),
      );
      flashUpdatedRow(message.asset_id ?? "");
    },
    [flashUpdatedRow],
  );

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
