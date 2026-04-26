// src\hooks\use-inbox-polling.ts
"use client";

import { useEffect } from "react";

type UseInboxPollingProps = {
  enabled: boolean;
  intervalMs?: number;
  onPoll: () => void | Promise<void>;
};

export function useInboxPolling({
  enabled,
  intervalMs = 5000,
  onPoll,
}: UseInboxPollingProps) {
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      void onPoll();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [enabled, intervalMs, onPoll]);
}
