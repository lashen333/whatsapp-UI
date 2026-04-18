// src\components\inbox\conversation-list.tsx
import { ConversationItem } from "@/types/inbox";
import { ConversationListItem } from "@/components/inbox/conversation-list-item";

type ConversationListProps = {
  conversations: ConversationItem[];
  selectedConversationId: string | null;
  onSelectConversation: (conversation: ConversationItem) => void;
  isLoading?: boolean;
};

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading = false,
}: ConversationListProps) {
  return (
    <aside className="flex h-full flex-col border-r bg-slate-50">
      <div className="border-b px-4 py-4">
        <h2 className="text-lg font-semibold text-black">Inbox</h2>
        <p className="text-sm text-slate-500">WhatsApp conversations</p>
      </div>

      <div className="flex-1 space-y-3 overflow-auto p-4">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading conversations...</p>
        ) : conversations.length === 0 ? (
          <p className="text-sm text-slate-500">No conversations found.</p>
        ) : (
          conversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              isActive={selectedConversationId === conversation.conversationId}
              onClick={() => onSelectConversation(conversation)}
            />
          ))
        )}
      </div>
    </aside>
  );
}