"use client";

import { processFileClient } from "@/lib/api/processFileClient";

export function ProcessFileRefreshButton() {
  return (
    <button
      type="button"
      onClick={() => {
        void processFileClient();
      }}
      aria-label="Process file"
      title="Process file"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border text-slate-400 transition hover:border-accent/50 hover:bg-accent-muted hover:text-white"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </button>
  );
}
