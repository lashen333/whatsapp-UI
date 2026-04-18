// src\lib\inbox\get-conversations.ts
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { waConversations } from "@/db/schema/wa-conversations";

export async function getConversations() {
  return db.query.waConversations.findMany({
    orderBy: [desc(waConversations.lastMessageAt)],
  });
}