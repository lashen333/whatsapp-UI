// src\lib\whatsapp\process-webhook-event.ts
import { processInboundMessage } from "@/lib/whatsapp/process-inbound-message";
import { processOutboundStatus } from "@/lib/whatsapp/process-outbound-status";
import { guessEventKind } from "@/lib/whatsapp/webhook-helpers";

type ProcessWebhookEventInput = {
  rawEventId: string;
  payload: unknown;
};

export async function processWebhookEvent({
  rawEventId,
  payload,
}: ProcessWebhookEventInput) {
  const eventKind = guessEventKind(payload);

  if (eventKind === "inbound_message") {
    await processInboundMessage({ rawEventId, payload });
    return;
  }

  if (eventKind === "outbound_status") {
    await processOutboundStatus({ rawEventId, payload });
    return;
  }
}