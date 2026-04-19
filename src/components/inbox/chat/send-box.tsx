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

    if (!trimmed || disabled || isSending) return;

    try {
      setIsSending(true);
      await onSend(trimmed);
      setText("");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="border-t bg-slate-50 px-4 py-3">
      <div className="flex items-end gap-3 rounded-2xl bg-white p-2 shadow-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={1}
          placeholder="Type a message"
          disabled={disabled || isSending}
          className="max-h-40 min-h-[44px] flex-1 resize-none rounded-xl px-3 py-2 text-sm text-black outline-none"
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              await handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={disabled || isSending || !text.trim()}
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
