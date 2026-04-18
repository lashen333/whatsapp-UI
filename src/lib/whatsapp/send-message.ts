// src\lib\whatsapp\send-message.ts
import { env } from "@/lib/env";

type SendTextMessageInput = {
  to: string;
  body: string;
  replyToMessageId?: string;
  previewUrl?: boolean;
};

export async function sendTextMessage(input: SendTextMessageInput) {
  const url = `https://graph.facebook.com/v23.0/${env.WA_PHONE_NUMBER_ID}/messages`;

  const payload: Record<string, unknown> = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: input.to,
    type: "text",
    text: {
      body: input.body,
      preview_url: input.previewUrl ?? false,
    },
  };

  if (input.replyToMessageId) {
    payload.context = {
      message_id: input.replyToMessageId,
    };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.WA_CLOUD_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `WhatsApp send failed: ${response.status} ${JSON.stringify(data)}`
    );
  }

  return {
    requestPayload: payload,
    responsePayload: data,
  };
}