// src\app\api\sheets\test\route.ts
import { NextResponse } from "next/server";
import { appendRawWebhookRow } from "@/lib/sheets/append-raw-webhook-row";

export async function GET() {
  try {
    const testPayload = {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "test-entry-id",
          changes: [
            {
              field: "messages",
              value: {
                messaging_product: "whatsapp",
                metadata: {
                  display_phone_number: "94770000000",
                  phone_number_id: "123456789",
                },
                contacts: [
                  {
                    profile: {
                      name: "Test User",
                    },
                    wa_id: "94771234567",
                  },
                ],
                messages: [
                  {
                    from: "94771234567",
                    id: "wamid.TEST123",
                    timestamp: "1710000000",
                    type: "text",
                    text: {
                      body: "Hello from test route",
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const result = await appendRawWebhookRow({
      webhookObject: "whatsapp_business_account",
      eventKind: "inbound_message",
      directionGuess: "inbound",
      messageIdGuess: "wamid.TEST123",
      conversationIdGuess: "",
      fromNumberGuess: "94771234567",
      toNumberGuess: "94770000000",
      payload: testPayload,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Sheets test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}