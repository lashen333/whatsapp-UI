// src\lib\whatsapp\process-inbound-message.ts
import { db } from "@/db";
import { waContacts } from "@/db/schema/wa-contacts";
import { waConversations } from "@/db/schema/wa-conversations";
import { waMessages } from "@/db/schema/wa-messages";
import { extractFirstContact, extractFirstMessage, extractMetadata } from "@/lib/whatsapp/extractors";
import { eq } from "drizzle-orm";

type ProcessInboundMessageInput = {
  rawEventId: string;
  payload: unknown;
};

function toIsoDateFromUnixTimestamp(timestamp?: string | null) {
  if (!timestamp) return null;
  const num = Number(timestamp);
  if (Number.isNaN(num)) return null;
  return new Date(num * 1000);
}

export async function processInboundMessage({
  rawEventId,
  payload,
}: ProcessInboundMessageInput) {
  const contact = extractFirstContact(payload);
  const message = extractFirstMessage(payload);
  const metadata = extractMetadata(payload);

  if (!message) return;

  const waId = typeof contact?.wa_id === "string" ? contact.wa_id : null;
  const profile = typeof contact?.profile === "object" && contact.profile !== null
    ? (contact.profile as Record<string, unknown>)
    : null;
  const profileName =
    typeof profile?.name === "string" ? profile.name : null;

  const fromNumber = typeof message.from === "string" ? message.from : null;
  const wamid = typeof message.id === "string" ? message.id : null;
  const messageType = typeof message.type === "string" ? message.type : null;
  const eventTimestamp = toIsoDateFromUnixTimestamp(
    typeof message.timestamp === "string" ? message.timestamp : null
  );

  if (!wamid) return;

  const textPayload =
    typeof message.text === "object" && message.text !== null
      ? (message.text as Record<string, unknown>)
      : null;

  const imagePayload =
    typeof message.image === "object" && message.image !== null
      ? (message.image as Record<string, unknown>)
      : null;

  const documentPayload =
    typeof message.document === "object" && message.document !== null
      ? (message.document as Record<string, unknown>)
      : null;

  const caption =
    typeof imagePayload?.caption === "string"
      ? imagePayload.caption
      : typeof documentPayload?.caption === "string"
      ? documentPayload.caption
      : null;

  const textBody =
    typeof textPayload?.body === "string" ? textPayload.body : null;

  const context =
    typeof message.context === "object" && message.context !== null
      ? (message.context as Record<string, unknown>)
      : null;

  const contextMessageId =
    typeof context?.id === "string" ? context.id : null;

  const phoneNumberId =
    typeof metadata?.phone_number_id === "string"
      ? metadata.phone_number_id
      : null;

  const displayPhoneNumber =
    typeof metadata?.display_phone_number === "string"
      ? metadata.display_phone_number
      : null;

  if (waId) {
    const existingContact = await db.query.waContacts.findFirst({
      where: eq(waContacts.waId, waId),
    });

    if (!existingContact) {
      await db.insert(waContacts).values({
        waId,
        phoneNumber: fromNumber,
        profileName,
      });
    }
  }

  const syntheticConversationId = `contact:${waId ?? fromNumber ?? "unknown"}`;

  const existingConversation = await db.query.waConversations.findFirst({
    where: eq(waConversations.conversationId, syntheticConversationId),
  });

  if (!existingConversation) {
    await db.insert(waConversations).values({
      conversationId: syntheticConversationId,
      customerWaId: waId,
      customerPhone: fromNumber,
      customerName: profileName,
      phoneNumberId,
      displayPhoneNumber,
      latestMessagePreview: textBody ?? caption ?? "[media]",
      unreadCount: 1,
      lastMessageAt: eventTimestamp,
      lastInboundAt: eventTimestamp,
    });
  } else {
    await db
      .update(waConversations)
      .set({
        customerWaId: waId,
        customerPhone: fromNumber,
        customerName: profileName,
        phoneNumberId,
        displayPhoneNumber,
        latestMessagePreview: textBody ?? caption ?? "[media]",
        unreadCount: (existingConversation.unreadCount ?? 0) + 1,
        lastMessageAt: eventTimestamp,
        lastInboundAt: eventTimestamp,
        updatedAt: new Date(),
      })
      .where(eq(waConversations.id, existingConversation.id));
  }

  await db.insert(waMessages).values({
    rawEventId,
    conversationId: syntheticConversationId,
    wamid,
    direction: "inbound",
    fromNumber,
    toNumber: displayPhoneNumber,
    waId,
    profileName,
    messageType,
    textBody,
    caption,
    contextMessageId,
    eventTimestamp,
    messageJson: message,
    fullEventJson: payload,
  });
}