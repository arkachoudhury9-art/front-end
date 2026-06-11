"use client";

import { useEffect, useState } from "react";

const PICA_MESSAGES = [
  "PICA is thinking",
  "PICA is analyzing",
  "PICA is monitoring",
  "PICA is detecting anomalies",
  "PICA is processing sensor data",
  "PICA is evaluating patterns",
];

const INTERVAL_MS = 5000;

export function PicaStatusIndicator() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setIndex((current) => (current + 1) % PICA_MESSAGES.length);
        setVisible(true);
      }, 300);
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center gap-2.5 rounded-full border border-accent/25 bg-accent-muted/60 px-3.5 py-1.5 ring-1 ring-accent/20"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>

      <span
        className={`text-xs font-medium text-accent transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {PICA_MESSAGES[index]}
        <span className="inline-flex w-4 justify-start">
          <span className="animate-[pulse_1.4s_ease-in-out_infinite]">.</span>
          <span className="animate-[pulse_1.4s_ease-in-out_0.2s_infinite]">.</span>
          <span className="animate-[pulse_1.4s_ease-in-out_0.4s_infinite]">.</span>
        </span>
      </span>
    </div>
  );
}
