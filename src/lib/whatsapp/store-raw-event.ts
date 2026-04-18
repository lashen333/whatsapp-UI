// src\lib\whatsapp\store-raw-event.ts
//add the raw event to the DB service file

import { db } from "@/db";
import { waRawEvents } from "@/db/schema/wa-raw-events";
import { createWebhookDedupeKey } from "@/lib/whatsapp/dedupe";
import {
  getWebhookObject,
  guessConversationId,
  guessDirection,
  guessEventKind,
  guessFromNumber,
  guessMessageId,
  guessToNumber,
} from "@/lib/whatsapp/webhook-helpers";

export async function storeRawWebhookEvent(payload: unknown) {
  const webhookObject = getWebhookObject(payload);
  const eventKind = guessEventKind(payload);
  const directionGuess = guessDirection(payload);
  const messageIdGuess = guessMessageId(payload);
  const conversationIdGuess = guessConversationId(payload);
  const fromNumberGuess = guessFromNumber(payload);
  const toNumberGuess = guessToNumber(payload);

  const dedupeKey = createWebhookDedupeKey(payload);

  const inserted = await db
    .insert(waRawEvents)
    .values({
      webhookObject,
      eventKind,
      directionGuess,
      messageIdGuess: messageIdGuess || null,
      conversationIdGuess: conversationIdGuess || null,
      fromNumberGuess: fromNumberGuess || null,
      toNumberGuess: toNumberGuess || null,
      dedupeKey,
      payloadJson: payload,
    })
    .onConflictDoNothing({
      target: waRawEvents.dedupeKey,
    })
    .returning();

  return inserted[0] ?? null;
}