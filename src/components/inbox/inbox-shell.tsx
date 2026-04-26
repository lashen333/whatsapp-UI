"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConversationSidebar } from "@/components/inbox/sidebar/conversation-sidebar";
import { ChatPanel } from "@/components/inbox/chat/chat-panel";
import { InspectorPanel } from "@/components/inbox/inspector-panel";
import {
  fetchConversationMessages,
  fetchConversations,
  fetchMessageRaw,
  markConversationRead,
  sendConversationMedia,
  sendConversationMessage,
} from "@/lib/inbox/api";
import { useInboxPolling } from "@/hooks/use-inbox-polling";
import { ConversationItem, MessageItem, MessageRawPayload } from "@/types/inbox";

export function InboxShell() {
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationItem | null>(null);

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
  const [selectedRawPayload, setSelectedRawPayload] =
    useState<MessageRawPayload | null>(null);

  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingRaw, setIsLoadingRaw] = useState(false);

  const hasInitializedRef = useRef(false);
  const lastMarkedReadConversationRef = useRef<string | null>(null);
  const lastLoadedRawMessageRef = useRef<string | null>(null);

  const selectedConversationId = selectedConversation?.conversationId ?? null;

  const loadConversations = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;

      try {
        if (!silent && !hasInitializedRef.current) {
          setIsLoadingConversations(true);
        }

        const data = await fetchConversations(search);
        setConversations(data);

        setSelectedConversation((current) => {
          if (current) {
            return (
              data.find(
                (item) => item.conversationId === current.conversationId
              ) ?? current
            );
          }

          return data[0] ?? null;
        });
      } catch (error) {
        console.error(error);
      } finally {
        if (!silent && !hasInitializedRef.current) {
          setIsLoadingConversations(false);
        }
      }
    },
    [search]
  );

  const loadMessages = useCallback(
    async (conversationId: string, options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;

      try {
        if (!silent) {
          setIsLoadingMessages(true);
        }

        const data = await fetchConversationMessages(conversationId);
        setMessages(data);

        setSelectedMessage((current) => {
          if (!current) return data[data.length - 1] ?? null;

          return data.find((item) => item.wamid === current.wamid) ?? current;
        });
      } catch (error) {
        console.error(error);
      } finally {
        if (!silent) {
          setIsLoadingMessages(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    async function init() {
      await loadConversations({ silent: false });
      hasInitializedRef.current = true;
    }

    void init();
  }, [loadConversations]);

  useEffect(() => {
    async function handleConversationChange() {
      if (!selectedConversationId) {
        setMessages([]);
        setSelectedMessage(null);
        setSelectedRawPayload(null);
        return;
      }

      await loadMessages(selectedConversationId, { silent: false });
    }

    void handleConversationChange();
  }, [selectedConversationId, loadMessages]);

  useEffect(() => {
    if (!selectedConversationId) return;

    if (lastMarkedReadConversationRef.current === selectedConversationId) {
      return;
    }

    lastMarkedReadConversationRef.current = selectedConversationId;

    void markConversationRead(selectedConversationId).catch((error) => {
      console.error("Mark conversation read failed:", error);
    });
  }, [selectedConversationId]);

  useEffect(() => {
    async function loadRawPayload() {
      if (!selectedMessage) {
        setSelectedRawPayload(null);
        lastLoadedRawMessageRef.current = null;
        return;
      }

      if (lastLoadedRawMessageRef.current === selectedMessage.wamid) {
        return;
      }

      try {
        setIsLoadingRaw(true);
        const data = await fetchMessageRaw(selectedMessage.wamid);
        setSelectedRawPayload(data);
        lastLoadedRawMessageRef.current = selectedMessage.wamid;
      } catch (error) {
        console.error(error);
        setSelectedRawPayload(null);
      } finally {
        setIsLoadingRaw(false);
      }
    }

    void loadRawPayload();
  }, [selectedMessage?.wamid]);

  useInboxPolling({
    enabled: hasInitializedRef.current,
    intervalMs: 5000,
    onPoll: async () => {
      await loadConversations({ silent: true });

      if (selectedConversationId) {
        await loadMessages(selectedConversationId, { silent: true });
      }
    },
  });

  async function handleSendMessage(text: string) {
    if (!selectedConversation?.customerPhone || !selectedConversationId) {
      throw new Error("Selected conversation has no customer phone number");
    }

    await sendConversationMessage({
      conversationId: selectedConversationId,
      to: selectedConversation.customerPhone,
      text,
    });

    await loadConversations({ silent: true });
    await loadMessages(selectedConversationId, { silent: true });
  }

  async function handleSendMedia(file: File, caption?: string) {
    if (!selectedConversation?.customerPhone || !selectedConversationId) {
      throw new Error("Selected conversation has no customer phone number");
    }

    await sendConversationMedia({
      conversationId: selectedConversationId,
      to: selectedConversation.customerPhone,
      file,
      caption,
    });

    await loadConversations({ silent: true });
    await loadMessages(selectedConversationId, { silent: true });
  }

  const threadTitle = useMemo(() => {
    return (
      selectedConversation?.customerName ||
      selectedConversation?.customerPhone ||
      "Select a conversation"
    );
  }, [selectedConversation]);

  const threadSubtitle = useMemo(() => {
    return selectedConversation?.customerPhone || "No phone number";
  }, [selectedConversation]);

  return (
    <div className="grid h-[calc(100vh-2rem)] grid-cols-1 overflow-hidden rounded-2xl border bg-white shadow-sm lg:grid-cols-12">
      <div className="flex h-full min-w-0 flex-col border-r lg:col-span-3 overflow-hidden">
        <ConversationSidebar
          search={search}
          onSearchChange={setSearch}
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversation}
          isLoading={isLoadingConversations}
        />
      </div>

      <div className="flex h-full min-w-0 flex-col lg:col-span-6 overflow-hidden">
        <ChatPanel
          title={threadTitle}
          subtitle={threadSubtitle}
          messages={messages}
          selectedMessageWamid={selectedMessage?.wamid ?? null}
          onSelectMessage={setSelectedMessage}
          onSendMessage={handleSendMessage}
          onSendMedia={handleSendMedia}
          isLoading={isLoadingMessages}
          isDisabled={!selectedConversation}
        />
      </div>

      <div className="hidden h-full min-w-0 flex-col border-l lg:col-span-3 lg:flex overflow-hidden">
        <InspectorPanel
          selectedMessage={selectedMessage}
          rawPayload={selectedRawPayload}
          isLoading={isLoadingRaw}
        />
      </div>
    </div>
  );
}