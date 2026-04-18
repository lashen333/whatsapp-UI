// src\lib\whatsapp\mark-message-read.ts
//Mark as read file
import { env } from "@/lib/env";

export async function markMessageAsRead(messageId: string) {
  const url = `https://graph.facebook.com/v23.0/${env.WA_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    status: "read",
    message_id: messageId,
  };

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
      `Mark as read failed: ${response.status} ${JSON.stringify(data)}`
    );
  }

  return data;
}