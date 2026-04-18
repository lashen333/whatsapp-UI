// src\components\inbox\send-box.tsx
"use client";

import { useState } from "react";

type SendBoxProps = {
  disabled?: boolean;
  onSend: (text: string) => Promise<void>;
};

export function SendBox({ disabled = false, onSend }: SendBoxProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSend() {
    const trimmed = text.trim();

    if (!trimmed || disabled || isSending) {
      return;
    }

    try {
      setIsSending(true);
      await onSend(trimmed);
      setText("");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="border-t bg-white p-4">
      <div className="flex items-end gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Type your reply..."
          disabled={disabled || isSending}
          className="min-h-[84px] flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        <button
          onClick={handleSend}
          disabled={disabled || isSending || !text.trim()}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}