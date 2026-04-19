"use client";

import { SearchInput } from "@/components/shared/search-input";
import { ConversationItem } from "@/types/inbox";
import { ConversationRow } from "@/components/inbox/sidebar/conversation-row";

type ConversationSidebarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  conversations: ConversationItem[];
  selectedConversationId: string | null;
  onSelectConversation: (conversation: ConversationItem) => void;
  isLoading?: boolean;
};

export function ConversationSidebar({
  search,
  onSearchChange,
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading = false,
}: ConversationSidebarProps) {
  return (
    <aside className="flex h-full flex-col bg-white">
      <div className="border-b px-4 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Chats</h2>
      </div>

      <div className="border-b px-4 py-3">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search or start new chat"
        />
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <p className="p-4 text-sm text-slate-500">Loading conversations...</p>
        ) : conversations.length === 0 ? (
          <p className="p-4 text-sm text-slate-500">No conversations found.</p>
        ) : (
          conversations.map((conversation) => (
            <ConversationRow
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
