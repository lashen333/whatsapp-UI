// src\lib\whatsapp\store-send-request.ts
import { db } from "@/db";
import { waSendRequests } from "@/db/schema/wa-send-requests";

type StoreSendRequestInput = {
  conversationId?: string | null;
  toNumber: string;
  requestJson: unknown;
  responseJson?: unknown;
  metaMessageId?: string | null;
  status: string;
  createdBy?: string | null;
};

export async function storeSendRequest(input: StoreSendRequestInput) {
  const inserted = await db
    .insert(waSendRequests)
    .values({
      conversationId: input.conversationId ?? null,
      toNumber: input.toNumber,
      requestJson: input.requestJson,
      responseJson: input.responseJson ?? null,
      metaMessageId: input.metaMessageId ?? null,
      status: input.status,
      createdBy: input.createdBy ?? "business_owner",
    })
    .returning();

  return inserted[0];
}