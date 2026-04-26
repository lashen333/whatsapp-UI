// src\components\inbox\raw-json-viewer.tsx
"use client";
import { useState } from "react";

type RawJsonViewerProps = {
  data: unknown;
};

export function RawJsonViewer({ data }: RawJsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative h-full">
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded-md bg-white/10 px-2 py-1 text-xs font-medium text-slate-300 hover:bg-white/20 transition-colors"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="h-full overflow-auto rounded-xl border bg-slate-950 p-4 pt-10 text-xs text-slate-100">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}