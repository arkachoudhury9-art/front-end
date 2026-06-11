"use client";

import { useEffect, useState } from "react";
import {
  getReasoningEvent,
  subscribeToReasoningEvents,
} from "@/lib/store/reasoningEventStore";
import type { ReasoningEvent } from "@/types/reasoning";

export function useReasoningEvent(assetId: string): ReasoningEvent | undefined {
  const [event, setEvent] = useState<ReasoningEvent | undefined>(() =>
    getReasoningEvent(assetId),
  );

  useEffect(() => {
    const sync = () => setEvent(getReasoningEvent(assetId));
    sync();
    return subscribeToReasoningEvents(sync);
  }, [assetId]);

  return event;
}
