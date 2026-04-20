//Media send helper

import { env } from "@/lib/env";

type SendMediaMessageInput = {
  to: string;
  mediaId: string;
  type: "image" | "video" | "audio" | "document";
  caption?: string;
  fileName?: string;
};

export async function sendMediaMessage(input: SendMediaMessageInput) {
  const url = `https://graph.facebook.com/v23.0/${env.WA_PHONE_NUMBER_ID}/messages`;

  let payload: Record<string, unknown> = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: input.to,
    type: input.type,
  };

  if (input.type === "image") {
    payload.image = {
      id: input.mediaId,
      ...(input.caption ? { caption: input.caption } : {}),
    };
  }

  if (input.type === "video") {
    payload.video = {
      id: input.mediaId,
      ...(input.caption ? { caption: input.caption } : {}),
    };
  }

  if (input.type === "audio") {
    payload.audio = {
      id: input.mediaId,
    };
  }

  if (input.type === "document") {
    payload.document = {
      id: input.mediaId,
      ...(input.caption ? { caption: input.caption } : {}),
      ...(input.fileName ? { filename: input.fileName } : {}),
    };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.WA_CLOUD_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Send media failed: ${response.status} ${JSON.stringify(data)}`
    );
  }

  return {
    requestPayload: payload,
    responsePayload: data,
  };
}