// src\lib\inbox\get-conversation-messages.ts
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { waMessages } from "@/db/schema/wa-messages";

export async function getConversationMessages(conversationId: string) {
  return db.query.waMessages.findMany({
    where: eq(waMessages.conversationId, conversationId),
    orderBy: [asc(waMessages.eventTimestamp)],
  });
}