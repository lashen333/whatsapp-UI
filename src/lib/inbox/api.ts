import { ConversationItem, MessageItem, MessageRawPayload } from "@/types/inbox";

/* -------------------------------------------------------------------------- */
/*                                Base Helper                                 */
/* -------------------------------------------------------------------------- */

async function handleResponse(response: Response) {
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

/* -------------------------------------------------------------------------- */
/*                           Fetch Conversations                              */
/* -------------------------------------------------------------------------- */

export async function fetchConversations(search = ""): Promise<ConversationItem[]> {
  const url = search
    ? `/api/whatsapp/conversations?search=${encodeURIComponent(search)}`
    : "/api/whatsapp/conversations";

  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  const data = await handleResponse(response);

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

/* -------------------------------------------------------------------------- */
/*                        Fetch Conversation Messages                         */
/* -------------------------------------------------------------------------- */

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

  const data = await handleResponse(response);

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

/* -------------------------------------------------------------------------- */
/*                              Fetch Raw Message                             */
/* -------------------------------------------------------------------------- */

export async function fetchMessageRaw(wamid: string): Promise<MessageRawPayload> {
  const response = await fetch(
    `/api/whatsapp/messages/${encodeURIComponent(wamid)}/raw`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const data = await handleResponse(response);

  return data.data;
}

/* -------------------------------------------------------------------------- */
/*                            Send Text Message                               */
/* -------------------------------------------------------------------------- */

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

  return handleResponse(response);
}

/* -------------------------------------------------------------------------- */
/*                             Send Media Message                             */
/* -------------------------------------------------------------------------- */

export async function sendConversationMedia(input: {
  conversationId: string;
  to: string;
  file: File;
  caption?: string;
}) {
  const formData = new FormData();

  formData.append("conversationId", input.conversationId);
  formData.append("to", input.to);
  formData.append("file", input.file);

  if (input.caption) {
    formData.append("caption", input.caption);
  }

  const response = await fetch("/api/whatsapp/send-media", {
    method: "POST",
    body: formData,
  });

  return handleResponse(response);
}

/* -------------------------------------------------------------------------- */
/*                          Mark Conversation Read                            */
/* -------------------------------------------------------------------------- */

export async function markConversationRead(conversationId: string) {
  const response = await fetch("/api/whatsapp/conversations/read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ conversationId }),
  });

  return handleResponse(response);
}