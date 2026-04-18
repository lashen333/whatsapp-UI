// src\lib\whatsapp\create-outbound-message-row.ts
import { db } from "@/db";
import { waMessages } from "@/db/schema/wa-messages";

type CreateOutboundMessageRowInput = {
  rawEventId?: string | null;
  conversationId?: string | null;
  wamid: string;
  fromNumber?: string | null;
  toNumber: string;
  textBody: string;
};

export async function createOutboundMessageRow(
  input: CreateOutboundMessageRowInput
) {
  const inserted = await db
    .insert(waMessages)
    .values({
      rawEventId: input.rawEventId ?? "00000000-0000-0000-0000-000000000000",
      conversationId: input.conversationId ?? null,
      wamid: input.wamid,
      direction: "outbound",
      fromNumber: input.fromNumber ?? null,
      toNumber: input.toNumber,
      messageType: "text",
      textBody: input.textBody,
      status: "accepted_by_api",
      fullEventJson: {
        source: "send_api",
        wamid: input.wamid,
        text: input.textBody,
      },
    })
    .onConflictDoNothing({
      target: waMessages.wamid,
    })
    .returning();

  return inserted[0] ?? null;
}