// src\components\inbox\message-bubble.tsx
import { MessageItem } from "@/types/inbox";

type MessageBubbleProps = {
  message: MessageItem;
  isSelected: boolean;
  onSelect: () => void;
};

export function MessageBubble({
  message,
  isSelected,
  onSelect,
}: MessageBubbleProps) {
  const isInbound = message.direction === "inbound";

  return (
    <div
      className={`flex w-full ${isInbound ? "justify-start" : "justify-end"}`}
    >
      <button
        onClick={onSelect}
        className={`max-w-[80%] rounded-2xl border px-4 py-3 text-left shadow-sm transition ${
          isInbound
            ? "border-slate-200 bg-white text-slate-900"
            : "border-slate-900 bg-slate-900 text-white"
        } ${isSelected ? "ring-2 ring-slate-300" : ""}`}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide">
            {message.direction}
          </span>
          {message.status ? (
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${
                isInbound
                  ? "bg-slate-100 text-slate-700"
                  : "bg-slate-700 text-slate-100"
              }`}
            >
              {message.status}
            </span>
          ) : null}
        </div>

        <p className="whitespace-pre-wrap break-words text-sm">
          {message.textBody || message.caption || `[${message.messageType || "message"}]`}
        </p>

        <p
          className={`mt-2 text-[11px] ${
            isInbound ? "text-slate-400" : "text-slate-300"
          }`}
        >
          {message.eventTimestamp
            ? new Date(message.eventTimestamp).toLocaleString()
            : "Unknown time"}
        </p>
      </button>
    </div>
  );
}