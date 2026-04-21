// src/app/api/whatsapp/webhook/route.ts
/*
saves raw event in DB
ignores duplicates
appends raw webhook rows to RAW_WEBHOOK_EVENTS
appends parsed event rows to RAW_WHATSAPP_EVENTS
processes webhook event for app DB logic
returns success
*/

import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { appendRawWebhookRow } from "@/lib/sheets/append-raw-webhook-row";
import { appendParsedWhatsAppRows } from "@/lib/sheets/append-parsed-whatsapp-rows";
import { processWebhookEvent } from "@/lib/whatsapp/process-webhook-event";
import { storeRawWebhookEvent } from "@/lib/whatsapp/store-raw-event";
import { mapWhatsAppPayloadToSheetRows } from "@/lib/whatsapp/sheets/map-payload-to-sheet-rows";
import {
  getWebhookObject,
  guessConversationId,
  guessDirection,
  guessEventKind,
  guessFromNumber,
  guessMessageId,
  guessToNumber,
} from "@/lib/whatsapp/webhook-helpers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json(
    { success: false, error: "Verification failed" },
    { status: 403 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const rawEvent = await storeRawWebhookEvent(payload);

    if (!rawEvent) {
      return NextResponse.json({
        success: true,
        duplicate: true,
      });
    }

    const webhookObject = getWebhookObject(payload);
    const eventKind = guessEventKind(payload);
    const directionGuess = guessDirection(payload);
    const messageIdGuess = guessMessageId(payload);
    const conversationIdGuess = guessConversationId(payload);
    const fromNumberGuess = guessFromNumber(payload);
    const toNumberGuess = guessToNumber(payload);

    // 1. Append the simple/raw webhook log row
    await appendRawWebhookRow({
      webhookObject,
      eventKind,
      directionGuess,
      messageIdGuess,
      conversationIdGuess,
      fromNumberGuess,
      toNumberGuess,
      payload,
    });

    // 2. Map this webhook payload into parsed sheet rows
    const parsedRows = mapWhatsAppPayloadToSheetRows(payload);

    // 3. Append parsed rows to the new RAW_WHATSAPP_EVENTS tab
    await appendParsedWhatsAppRows(parsedRows);

    // 4. Process webhook for application DB logic
    await processWebhookEvent({
      rawEventId: rawEvent.id,
      payload,
    });

    return NextResponse.json({
      success: true,
      stored: true,
      rawEventId: rawEvent.id,
      parsedRowCount: parsedRows.length,
    });
  } catch (error) {
    console.error("Webhook processing failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}