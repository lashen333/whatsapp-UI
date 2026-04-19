import { ConversationItem, MessageItem, MessageRawPayload } from "@/types/inbox";

export async function fetchConversations(search = ""): Promise<ConversationItem[]> {
  const url = search
    ? `/api/whatsapp/conversations?search=${encodeURIComponent(search)}`
    : "/api/whatsapp/conversations";

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch conversations");
  }

  return (data.conversations || []).map((item: any) => ({
    id: item.id,
    conversationId: item.conversationId,
    customerName: item.customerName ?? null,
    customerPhone: item.customerPhone ?? null,
    latestMessagePreview: item.latestMessagePreview ?? null,
    unreadCount: item.unreadCount ?? 0,
    lastMessageAt: item.lastMessageAt ?? null,
  }));
}

export async function fetchConversationMessages(
  conversationId: string
): Promise<MessageItem[]> {
  const response = await fetch(
    `/api/whatsapp/conversations/${encodeURIComponent(conversationId)}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch conversation messages");
  }

  return (data.messages || []).map((item: any) => ({
    id: item.id,
    wamid: item.wamid,
    conversationId: item.conversationId ?? null,
    direction: item.direction,
    fromNumber: item.fromNumber ?? null,
    toNumber: item.toNumber ?? null,
    waId: item.waId ?? null,
    profileName: item.profileName ?? null,
    messageType: item.messageType ?? null,
    textBody: item.textBody ?? null,
    caption: item.caption ?? null,
    status: item.status ?? null,
    contextMessageId: item.contextMessageId ?? null,
    eventTimestamp: item.eventTimestamp ?? null,
    mediaUrl: item.mediaUrl ?? null,
    mimeType: item.mimeType ?? null,
    fileName: item.fileName ?? null,
  }));
}

export async function fetchMessageRaw(wamid: string): Promise<MessageRawPayload> {
  const response = await fetch(
    `/api/whatsapp/messages/${encodeURIComponent(wamid)}/raw`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch raw message data");
  }

  return data.data;
}

export async function sendConversationMessage(input: {
  conversationId: string;
  to: string;
  text: string;
  replyToMessageId?: string;
}) {
  const response = await fetch("/api/whatsapp/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to send message");
  }

  return data;
}

export async function markConversationRead(conversationId: string) {
  const response = await fetch("/api/whatsapp/conversations/read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ conversationId }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to mark conversation as read");
  }

  return data;
}