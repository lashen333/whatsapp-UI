import { ConversationItem } from "@/types/inbox";

type ConversationRowProps = {
  conversation: ConversationItem;
  isActive: boolean;
  onClick: () => void;
};

export function ConversationRow({
  conversation,
  isActive,
  onClick,
}: ConversationRowProps) {
  const name = conversation.customerName || conversation.customerPhone || "Unknown";
  const preview = conversation.latestMessagePreview || "No messages yet";
  const time = conversation.lastMessageAt
    ? new Date(conversation.lastMessageAt).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-3 border-b px-4 py-3 text-left transition ${
        isActive ? "bg-slate-100" : "bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
        {name.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
          <p className="shrink-0 text-xs text-slate-500">{time}</p>
        </div>

        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="truncate text-sm text-slate-500">{preview}</p>

          {conversation.unreadCount > 0 ? (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white">
              {conversation.unreadCount}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}
