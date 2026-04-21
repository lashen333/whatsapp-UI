// src\lib\sheets\append-parsed-whatsapp-rows.ts
import { env } from "@/lib/env";
import { createSheetsClient } from "@/lib/sheets/sheets-client";
import {
    WHATSAPP_PARSED_SHEET_HEADERS,
    WhatsAppParsedSheetRow,
} from "@/lib/whatsapp/sheets/parsed-columns";

export async function appendParsedWhatsAppRows(
    rows: WhatsAppParsedSheetRow[]
) {
    if (rows.length === 0) return;

    const sheets = createSheetsClient();

    const values = rows.map((row) =>
        WHATSAPP_PARSED_SHEET_HEADERS.map((header) => row[header] ?? "")
    );

    await sheets.spreadsheets.values.append({
        spreadsheetId: env.GOOGLE_SHEET_ID,
        range: "RAW_WHATSAPP_EVENTS_FINALLY!A:BM",
        valueInputOption: "RAW",
        requestBody: {
            values,
        },
    });
}