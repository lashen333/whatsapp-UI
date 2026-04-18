// src\components\inbox\inspector-panel.tsx
"use client";

import { useMemo, useState } from "react";
import { MessageItem, MessageRawPayload } from "@/types/inbox";
import { RawJsonViewer } from "@/components/inbox/raw-json-viewer";

type InspectorPanelProps = {
  selectedMessage: MessageItem | null;
  rawPayload: MessageRawPayload | null;
  isLoading?: boolean;
};

type TabKey = "summary" | "message" | "raw";

export function InspectorPanel({
  selectedMessage,
  rawPayload,
  isLoading = false,
}: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("summary");

  const summaryRows = useMemo(() => {
    if (!selectedMessage) return [];

    return [
      { label: "WAMID", value: selectedMessage.wamid },
      { label: "Direction", value: selectedMessage.direction },
      { label: "Type", value: selectedMessage.messageType || "-" },
      { label: "From", value: selectedMessage.fromNumber || "-" },
      { label: "To", value: selectedMessage.toNumber || "-" },
      { label: "Status", value: selectedMessage.status || "-" },
      {
        label: "Timestamp",
        value: selectedMessage.eventTimestamp
          ? new Date(selectedMessage.eventTimestamp).toLocaleString()
          : "-",
      },
      { label: "Context Message", value: selectedMessage.contextMessageId || "-" },
    ];
  }, [selectedMessage]);

  return (
    <aside className="flex h-full flex-col border-l bg-white">
      <div className="border-b px-4 py-4">
        <h2 className="text-lg font-semibold text-black">Inspector</h2>
        <p className="text-sm text-slate-500">Message details and raw event data</p>
      </div>

      <div className="flex gap-2 border-b p-3">
        <button
          onClick={() => setActiveTab("summary")}
          className={`rounded-lg px-3 py-2 text-sm text-slate-700 ${
            activeTab === "summary" ? "bg-slate-900 text-white" : "bg-slate-100"
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab("message")}
          className={`rounded-lg px-3 py-2 text-sm text-slate-700 ${
            activeTab === "message" ? "bg-slate-900 text-white" : "bg-slate-100"
          }`}
        >
          Message Data
        </button>
        <button
          onClick={() => setActiveTab("raw")}
          className={`rounded-lg px-3 py-2 text-sm text-slate-700 ${
            activeTab === "raw" ? "bg-slate-900 text-white" : "bg-slate-100"
          }`}
        >
          Raw JSON
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {!selectedMessage ? (
          <p className="text-sm text-slate-500">Select a message to inspect.</p>
        ) : isLoading ? (
          <p className="text-sm text-slate-500">Loading message details...</p>
        ) : activeTab === "summary" ? (
          <div className="space-y-3">
            {summaryRows.map((row) => (
              <div key={row.label} className="rounded-xl border p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {row.label}
                </p>
                <p className="mt-1 break-all text-sm text-slate-900">{row.value}</p>
              </div>
            ))}
          </div>
        ) : activeTab === "message" ? (
          <RawJsonViewer data={rawPayload?.messageJson ?? rawPayload?.statusJson ?? {}} />
        ) : (
          <RawJsonViewer data={rawPayload?.fullEventJson ?? {}} />
        )}
      </div>
    </aside>
  );
}