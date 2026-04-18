// src\lib\sheets\append-raw-webhook-row.ts
import { v4 as uuidv4 } from "uuid";
import { env } from "@/lib/env";
import { createSheetsClient } from "@/lib/sheets/sheets-client";

type AppendRawWebhookRowInput = {
  webhookObject: string;
  eventKind: string;
  directionGuess: string;
  messageIdGuess: string;
  conversationIdGuess: string;
  fromNumberGuess: string;
  toNumberGuess: string;
  payload: unknown;
};

export async function appendRawWebhookRow(
  input: AppendRawWebhookRowInput
) {
  const sheets = createSheetsClient();

  const rowId = uuidv4();
  const receivedAt = new Date().toISOString();

  await sheets.spreadsheets.values.append({
    spreadsheetId: env.GOOGLE_SHEET_ID,
    range: "RAW_WEBHOOK_EVENTS!A:J",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          rowId,
          receivedAt,
          input.webhookObject,
          input.eventKind,
          input.directionGuess,
          input.messageIdGuess,
          input.conversationIdGuess,
          input.fromNumberGuess,
          input.toNumberGuess,
          JSON.stringify(input.payload),
        ],
      ],
    },
  });

  return {
    rowId,
    receivedAt,
  };
}