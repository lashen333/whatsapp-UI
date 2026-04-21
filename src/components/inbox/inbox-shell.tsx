// src\components\inbox\inbox-shell.tsx
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
  sendConversationMessage,
  sendConversationMedia,
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

  const loadConversations = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;

      try {
        if (!silent && !hasInitializedRef.current) {
          setIsLoadingConversations(true);
        }

        const data = await fetchConversations(search);
        setConversations(data);

        if (!selectedConversation && data.length > 0) {
          setSelectedConversation(data[0]);
          return;
        }

        if (selectedConversation) {
          const stillExists = data.find(
            (item) => item.conversationId === selectedConversation.conversationId
          );

          if (stillExists) {
            setSelectedConversation((prev) => {
              if (!prev) return stillExists;
              if (prev.conversationId !== stillExists.conversationId) {
                return stillExists;
              }

              return {
                ...prev,
                ...stillExists,
              };
            });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!silent && !hasInitializedRef.current) {
          setIsLoadingConversations(false);
        }
      }
    },
    [search, selectedConversation]
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
      if (!selectedConversation) {
        setMessages([]);
        setSelectedMessage(null);
        setSelectedRawPayload(null);
        return;
      }

      await loadMessages(selectedConversation.conversationId, { silent: false });

      if (
        lastMarkedReadConversationRef.current !== selectedConversation.conversationId
      ) {
        try {
          await markConversationRead(selectedConversation.conversationId);
          lastMarkedReadConversationRef.current =
            selectedConversation.conversationId;
        } catch (error) {
          console.error(error);
        }
      }
    }

    void handleConversationChange();
  }, [selectedConversation, loadMessages]);

  useEffect(() => {
    async function loadRawPayload() {
      if (!selectedMessage) {
        setSelectedRawPayload(null);
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
      } finally {
        setIsLoadingRaw(false);
      }
    }

    void loadRawPayload();
  }, [selectedMessage]);

  useInboxPolling({
    enabled: hasInitializedRef.current,
    intervalMs: 5000,
    onPoll: async () => {
      await loadConversations({ silent: true });

      if (selectedConversation?.conversationId) {
        await loadMessages(selectedConversation.conversationId, {
          silent: true,
        });
      }
    },
  });

  async function handleSendMessage(text: string) {
    if (!selectedConversation?.customerPhone) {
      throw new Error("Selected conversation has no customer phone number");
    }

    await sendConversationMessage({
      conversationId: selectedConversation.conversationId,
      to: selectedConversation.customerPhone,
      text,
    });

    await loadConversations({ silent: true });
    await loadMessages(selectedConversation.conversationId, { silent: true });
  }

  async function handleSendMedia(file:File,caption?:string){
    if(!selectedConversation?.customerPhone){
      throw new Error("Selected conversation has no customer phone number");
    }
    await sendConversationMedia({
      conversationId: selectedConversation.conversationId,
      to: selectedConversation.customerPhone,
      file,
      caption,
    });

    await loadConversations({ silent: true });
    await loadMessages(selectedConversation.conversationId, { silent: true });
  
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
          selectedConversationId={selectedConversation?.conversationId ?? null}
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