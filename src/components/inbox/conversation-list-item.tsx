// src\components\inbox\conversation-list-item.tsx
import { ConversationItem } from "@/types/inbox";

type ConversationListItemProps = {
  conversation: ConversationItem;
  isActive: boolean;
  onClick: () => void;
};

export function ConversationListItem({
  conversation,
  isActive,
  onClick,
}: ConversationListItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-3 text-left transition ${
        isActive
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {conversation.customerName || conversation.customerPhone || "Unknown contact"}
          </p>
          <p
            className={`truncate text-xs ${
              isActive ? "text-slate-300" : "text-slate-500"
            }`}
          >
            {conversation.customerPhone || "No phone"}
          </p>
        </div>

        {conversation.unreadCount > 0 ? (
          <span
            className={`inline-flex min-w-6 items-center justify-center rounded-full px-2 py-1 text-xs font-semibold ${
              isActive ? "bg-white text-slate-900" : "bg-slate-900 text-white"
            }`}
          >
            {conversation.unreadCount}
          </span>
        ) : null}
      </div>

      <p
        className={`mt-2 truncate text-sm ${
          isActive ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {conversation.latestMessagePreview || "No messages yet"}
      </p>

      <p
        className={`mt-2 text-xs ${
          isActive ? "text-slate-400" : "text-slate-400"
        }`}
      >
        {conversation.lastMessageAt
          ? new Date(conversation.lastMessageAt).toLocaleString()
          : "No activity"}
      </p>
    </button>
  );
}