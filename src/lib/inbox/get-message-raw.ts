// src\lib\inbox\get-message-raw.ts
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { waMessages } from "@/db/schema/wa-messages";

export async function getMessageRaw(wamid: string) {
  return db.query.waMessages.findFirst({
    where: eq(waMessages.wamid, wamid),
  });
}