// src\components\inbox\inbox-shell.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { ConversationList } from "@/components/inbox/conversation-list";
import { ChatThread } from "@/components/inbox/chat-thread";
import { InspectorPanel } from "@/components/inbox/inspector-panel";
import {
  fetchConversationMessages,
  fetchConversations,
  fetchMessageRaw,
  sendConversationMessage,
} from "@/lib/inbox/api";
import { ConversationItem, MessageItem, MessageRawPayload } from "@/types/inbox";

export function InboxShell() {
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

  useEffect(() => {
    async function loadConversations() {
      try {
        setIsLoadingConversations(true);
        const data = await fetchConversations();
        setConversations(data);

        if (data.length > 0) {
          setSelectedConversation(data[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingConversations(false);
      }
    }

    loadConversations();
  }, []);

  useEffect(() => {
    async function loadMessages() {
      if (!selectedConversation) {
        setMessages([]);
        setSelectedMessage(null);
        setSelectedRawPayload(null);
        return;
      }

      try {
        setIsLoadingMessages(true);
        const data = await fetchConversationMessages(selectedConversation.conversationId);
        setMessages(data);

        if (data.length > 0) {
          setSelectedMessage(data[data.length - 1]);
        } else {
          setSelectedMessage(null);
          setSelectedRawPayload(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingMessages(false);
      }
    }

    loadMessages();
  }, [selectedConversation]);

  useEffect(() => {
    async function loadRawPayload() {
      if (!selectedMessage) {
        setSelectedRawPayload(null);
        return;
      }

      try {
        setIsLoadingRaw(true);
        const data = await fetchMessageRaw(selectedMessage.wamid);
        setSelectedRawPayload(data);
      } catch (error) {
        console.error(error);
        setSelectedRawPayload(null);
      } finally {
        setIsLoadingRaw(false);
      }
    }

    loadRawPayload();
  }, [selectedMessage]);

  async function handleSendMessage(text: string) {
    if (!selectedConversation?.customerPhone) {
      throw new Error("Selected conversation has no customer phone number");
    }

    await sendConversationMessage({
      conversationId: selectedConversation.conversationId,
      to: selectedConversation.customerPhone,
      text,
    });

    const [refreshedMessages,refreshedConversations] = await Promise.all([
        fetchConversationMessages(selectedConversation.conversationId),
        fetchConversations(),

    ]);

    setMessages(refreshedMessages);
    setConversations(refreshedConversations);

    const updatedSelectedConversation = 
    refreshedConversations.find(
        (item) => item.conversationId === selectedConversation.conversationId) ?? selectedConversation;

    setSelectedConversation(updatedSelectedConversation);

    if (refreshedMessages.length > 0) {
      setSelectedMessage(refreshedMessages[refreshedMessages.length - 1]);
    }
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
      <div className="lg:col-span-3 min-w-0">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversation?.conversationId ?? null}
          onSelectConversation={setSelectedConversation}
          isLoading={isLoadingConversations}
        />
      </div>

      <div className="lg:col-span-6 min-w-0">
        <ChatThread
          title={threadTitle}
          subtitle={threadSubtitle}
          messages={messages}
          selectedMessageWamid={selectedMessage?.wamid ?? null}
          onSelectMessage={setSelectedMessage}
          onSendMessage={handleSendMessage}
          isLoading={isLoadingMessages}
          isDisabled={!selectedConversation}
        />
      </div>

      <div className="lg:col-span-3 min-w-0">
        <InspectorPanel
          selectedMessage={selectedMessage}
          rawPayload={selectedRawPayload}
          isLoading={isLoadingRaw}
        />
      </div>
    </div>
  );
}