// src\lib\whatsapp\webhook-helpers.ts
type AnyRecord = Record<string, unknown>;

function asRecord(value: unknown): AnyRecord | null {
  return typeof value === "object" && value !== null ? (value as AnyRecord) : null;
}

export function getWebhookObject(payload: unknown): string {
  const record = asRecord(payload);
  return typeof record?.object === "string" ? record.object : "unknown";
}

export function getFirstEntry(payload: unknown): AnyRecord | null {
  const record = asRecord(payload);
  const entry = record?.entry;

  if (!Array.isArray(entry) || entry.length === 0) {
    return null;
  }

  return asRecord(entry[0]);
}

export function getFirstChange(payload: unknown): AnyRecord | null {
  const entry = getFirstEntry(payload);
  const changes = entry?.changes;

  if (!Array.isArray(changes) || changes.length === 0) {
    return null;
  }

  return asRecord(changes[0]);
}

export function getChangeValue(payload: unknown): AnyRecord | null {
  const change = getFirstChange(payload);
  return asRecord(change?.value);
}

export function guessEventKind(payload: unknown): string {
  const value = getChangeValue(payload);

  if (!value) return "unknown";

  if (Array.isArray(value.messages) && value.messages.length > 0) {
    return "inbound_message";
  }

  if (Array.isArray(value.statuses) && value.statuses.length > 0) {
    return "outbound_status";
  }

  return "unknown";
}

export function guessDirection(payload: unknown): string {
  const eventKind = guessEventKind(payload);

  if (eventKind === "inbound_message") return "inbound";
  if (eventKind === "outbound_status") return "outbound";

  return "unknown";
}

export function guessMessageId(payload: unknown): string {
  const value = getChangeValue(payload);

  if (!value) return "";

  if (Array.isArray(value.messages) && value.messages.length > 0) {
    const firstMessage = asRecord(value.messages[0]);
    return typeof firstMessage?.id === "string" ? firstMessage.id : "";
  }

  if (Array.isArray(value.statuses) && value.statuses.length > 0) {
    const firstStatus = asRecord(value.statuses[0]);
    return typeof firstStatus?.id === "string" ? firstStatus.id : "";
  }

  return "";
}

export function guessConversationId(payload: unknown): string {
  const value = getChangeValue(payload);

  if (!value) return "";

  if (Array.isArray(value.statuses) && value.statuses.length > 0) {
    const firstStatus = asRecord(value.statuses[0]);
    const conversation = asRecord(firstStatus?.conversation);
    return typeof conversation?.id === "string" ? conversation.id : "";
  }

  return "";
}

export function guessFromNumber(payload: unknown): string {
  const value = getChangeValue(payload);

  if (!value) return "";

  if (Array.isArray(value.messages) && value.messages.length > 0) {
    const firstMessage = asRecord(value.messages[0]);
    return typeof firstMessage?.from === "string" ? firstMessage.from : "";
  }

  return "";
}

export function guessToNumber(payload: unknown): string {
  const value = getChangeValue(payload);
  const metadata = asRecord(value?.metadata);

  if (!metadata) return "";

  return typeof metadata.display_phone_number === "string"
    ? metadata.display_phone_number
    : "";
}