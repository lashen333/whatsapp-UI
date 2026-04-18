// src\lib\whatsapp\dedupe.ts
import crypto from "node:crypto";

export function createWebhookDedupeKey(payload: unknown): string {
  const serialized = JSON.stringify(payload);
  return crypto.createHash("sha256").update(serialized).digest("hex");
}