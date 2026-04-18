// src\types\inbox.ts
export type ConversationItem = {
  id: string;
  conversationId: string;
  customerName: string | null;
  customerPhone: string | null;
  latestMessagePreview: string | null;
  unreadCount: number;
  lastMessageAt: string | null;
};

export type MessageItem = {
  id: string;
  wamid: string;
  conversationId: string | null;
  direction: "inbound" | "outbound" | string;
  fromNumber: string | null;
  toNumber: string | null;
  waId: string | null;
  profileName: string | null;
  messageType: string | null;
  textBody: string | null;
  caption: string | null;
  status: string | null;
  contextMessageId: string | null;
  eventTimestamp: string | null;
};

export type MessageRawPayload = {
  messageJson: unknown;
  statusJson: unknown;
  fullEventJson: unknown;
};