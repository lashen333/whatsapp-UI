// src\lib\whatsapp\process-outbound-status.ts
import { db } from "@/db";
import { waConversations } from "@/db/schema/wa-conversations";
import { waMessages } from "@/db/schema/wa-messages";
import { extractFirstStatus, extractMetadata } from "@/lib/whatsapp/extractors";
import { eq } from "drizzle-orm";

type ProcessOutboundStatusInput = {
  rawEventId: string;
  payload: unknown;
};

function toIsoDateFromUnixTimestamp(timestamp?: string | null) {
  if (!timestamp) return null;
  const num = Number(timestamp);
  if (Number.isNaN(num)) return null;
  return new Date(num * 1000);
}

export async function processOutboundStatus({
  rawEventId,
  payload,
}: ProcessOutboundStatusInput) {
  const status = extractFirstStatus(payload);
  const metadata = extractMetadata(payload);

  if (!status) return;

  const wamid = typeof status.id === "string" ? status.id : null;
  if (!wamid) return;

  const conversation =
    typeof status.conversation === "object" && status.conversation !== null
      ? (status.conversation as Record<string, unknown>)
      : null;

  const conversationId =
    typeof conversation?.id === "string" ? conversation.id : null;

  const recipientId =
    typeof status.recipient_id === "string" ? status.recipient_id : null;

  const statusValue =
    typeof status.status === "string" ? status.status : null;

  const eventTimestamp = toIsoDateFromUnixTimestamp(
    typeof status.timestamp === "string" ? status.timestamp : null
  );

  const displayPhoneNumber =
    typeof metadata?.display_phone_number === "string"
      ? metadata.display_phone_number
      : null;

  const existingMessage = await db.query.waMessages.findFirst({
    where: eq(waMessages.wamid, wamid),
  });

  if (!existingMessage) {
    await db.insert(waMessages).values({
      rawEventId,
      conversationId,
      wamid,
      direction: "outbound",
      fromNumber: displayPhoneNumber,
      toNumber: recipientId,
      status: statusValue,
      eventTimestamp,
      statusJson: status,
      fullEventJson: payload,
    });
  } else {
    await db
      .update(waMessages)
      .set({
        status: statusValue,
        eventTimestamp,
        statusJson: status,
        updatedAt: new Date(),
      })
      .where(eq(waMessages.id, existingMessage.id));
  }

  if (conversationId) {
    const existingConversation = await db.query.waConversations.findFirst({
      where: eq(waConversations.conversationId, conversationId),
    });

    if (!existingConversation) {
      await db.insert(waConversations).values({
        conversationId,
        customerPhone: recipientId,
        displayPhoneNumber,
        latestMessagePreview: `[${statusValue ?? "status"}]`,
        lastMessageAt: eventTimestamp,
        lastOutboundAt: eventTimestamp,
      });
    } else {
      await db
        .update(waConversations)
        .set({
          customerPhone: recipientId,
          displayPhoneNumber,
          latestMessagePreview: `[${statusValue ?? "status"}]`,
          lastMessageAt: eventTimestamp,
          lastOutboundAt: eventTimestamp,
          updatedAt: new Date(),
        })
        .where(eq(waConversations.id, existingConversation.id));
    }
  }
}