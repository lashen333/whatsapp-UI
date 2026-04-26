// src\components\inbox\chat\message-bubble.tsx
import { MessageItem } from "@/types/inbox";
import { MessageMedia } from "@/components/inbox/chat/message-media";
import { ReplyContextPreview } from "@/components/inbox/chat/reply-context-preview";

type MessageBubbleProps = {
  message: MessageItem;
  isSelected: boolean;
  onSelect: () => void;
  replyPreviewText?: string | null;
};

export function MessageBubble({
  message,
  isSelected,
  onSelect,
  replyPreviewText,
}: MessageBubbleProps) {
  const isInbound = message.direction === "inbound";

  return (
    <div className={`flex ${isInbound ? "justify-start" : "justify-end"}`}>
      <button
        onClick={onSelect}
        className={`max-w-[78%] rounded-2xl px-3 py-2 text-left shadow-sm transition ${
          isInbound
            ? "bg-white text-slate-900"
            : "bg-emerald-100 text-slate-900"
        } ${isSelected ? "ring-2 ring-slate-300" : ""}`}
      >
        {message.contextMessageId && replyPreviewText ? (
          <ReplyContextPreview text={replyPreviewText} />
        ) : null}

        <MessageMedia
          messageType={message.messageType}
          mediaUrl={message.mediaUrl}
          fileName={message.fileName}
          mimeType={message.mimeType}
        />

        {message.textBody ? (
          <p className="mt-1 whitespace-pre-wrap break-words text-sm">
            {message.textBody}
          </p>
        ) : null}

        {!message.textBody && message.caption ? (
          <p className="mt-1 whitespace-pre-wrap break-words text-sm">
            {message.caption}
          </p>
        ) : null}

        <div className="mt-2 flex items-center justify-end gap-2">
          <span className="text-[11px] text-slate-500">
            {message.eventTimestamp
              ? new Date(message.eventTimestamp).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : ""}
          </span>

          {!isInbound && message.status ? (
            <span className="text-[11px] text-slate-500">{message.status}</span>
          ) : null}
        </div>
      </button>
    </div>
  );
}
