// src\app\api\whatsapp\send\route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendTextMessage } from "@/lib/whatsapp/send-message";
import { storeSendRequest } from "@/lib/whatsapp/store-send-request";
import { createOutboundMessageRow } from "@/lib/whatsapp/create-outbound-message-row";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const to =
      typeof body.to === "string" ? body.to.trim() : "";
    const text =
      typeof body.text === "string" ? body.text.trim() : "";
    const conversationId =
      typeof body.conversationId === "string" ? body.conversationId : null;
    const replyToMessageId =
      typeof body.replyToMessageId === "string" ? body.replyToMessageId : undefined;

    if (!to) {
      return NextResponse.json(
        { success: false, error: "Missing 'to'" },
        { status: 400 }
      );
    }

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Missing 'text'" },
        { status: 400 }
      );
    }

    const result = await sendTextMessage({
      to,
      body: text,
      replyToMessageId,
    });

    const messages = Array.isArray((result.responsePayload as Record<string, unknown>)?.messages)
      ? ((result.responsePayload as Record<string, unknown>).messages as Array<Record<string, unknown>>)
      : [];

    const firstMessage = messages[0] ?? null;
    const metaMessageId =
      firstMessage && typeof firstMessage.id === "string"
        ? firstMessage.id
        : null;

    const sendRequest = await storeSendRequest({
      conversationId,
      toNumber: to,
      requestJson: result.requestPayload,
      responseJson: result.responsePayload,
      metaMessageId,
      status: "accepted_by_api",
    });

    if(metaMessageId){
        await createOutboundMessageRow({
            conversationId,
            wamid: metaMessageId,
            toNumber: to,
            textBody: text,
        });
    }

    return NextResponse.json({
      success: true,
      sendRequestId: sendRequest.id,
      metaMessageId,
      response: result.responsePayload,
    });
  } catch (error) {
    console.error("Send message failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}