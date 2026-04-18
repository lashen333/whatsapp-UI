// src\lib\whatsapp\extractors.ts
//this file create the raw webhook into live inbox data

type AnyRecord = Record<string, unknown>;

function asRecord(value: unknown): AnyRecord | null {
  return typeof value === "object" && value !== null ? (value as AnyRecord) : null;
}

export function extractValue(payload: unknown): AnyRecord | null {
  const root = asRecord(payload);
  const entry = Array.isArray(root?.entry) ? root.entry[0] : null;
  const entryRecord = asRecord(entry);
  const changes = Array.isArray(entryRecord?.changes) ? entryRecord.changes[0] : null;
  const changeRecord = asRecord(changes);
  return asRecord(changeRecord?.value);
}

export function extractFirstContact(payload: unknown): AnyRecord | null {
  const value = extractValue(payload);
  if (!value || !Array.isArray(value.contacts) || value.contacts.length === 0) {
    return null;
  }
  return asRecord(value.contacts[0]);
}

export function extractFirstMessage(payload: unknown): AnyRecord | null {
  const value = extractValue(payload);
  if (!value || !Array.isArray(value.messages) || value.messages.length === 0) {
    return null;
  }
  return asRecord(value.messages[0]);
}

export function extractFirstStatus(payload: unknown): AnyRecord | null {
  const value = extractValue(payload);
  if (!value || !Array.isArray(value.statuses) || value.statuses.length === 0) {
    return null;
  }
  return asRecord(value.statuses[0]);
}

export function extractMetadata(payload: unknown): AnyRecord | null {
  const value = extractValue(payload);
  return asRecord(value?.metadata);
}