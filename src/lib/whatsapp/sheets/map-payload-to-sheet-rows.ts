import { createEmptyParsedRow, parseCommonColumns } from "@/lib/whatsapp/sheets/parse-common-columns";
import { parseMessageColumns } from "@/lib/whatsapp/sheets/parse-message-columns";
import { parseStatusColumns } from "@/lib/whatsapp/sheets/parse-status-columns";
import { WhatsAppParsedSheetRow } from "@/lib/whatsapp/sheets/parsed-columns";
import { asRecord } from "@/lib/whatsapp/sheets/parser-utils";

export function mapWhatsAppPayloadToSheetRows(
    payload: unknown
): WhatsAppParsedSheetRow[] {
    const common = parseCommonColumns(payload);
    const value = common.value;

    if (!value) return [];

    const contacts = Array.isArray(value.contacts) ? value.contacts : [];
    const messages = Array.isArray(value.messages) ? value.messages : [];
    const statuses = Array.isArray(value.statuses) ? value.statuses : [];

    const firstContact = asRecord(contacts[0]);

    const rows: WhatsAppParsedSheetRow[] = [];

    for (const item of messages) {
        const message = asRecord(item);
        if (!message) continue;

        const row = createEmptyParsedRow();

        row.object = common.object;
        row.entry_id = common.entry_id;
        row.field = common.field;
        row.messaging_product = common.messaging_product;
        row.display_phone_number = common.display_phone_number;
        row.phone_number_id = common.phone_number_id;
        row.payload_json = common.payload_json;

        rows.push(
            parseMessageColumns({
                row,
                message,
                contact: firstContact,
            })
        );
    }

    for (const item of statuses) {
        const statusObj = asRecord(item);
        if (!statusObj) continue;

        const row = createEmptyParsedRow();

        row.object = common.object;
        row.entry_id = common.entry_id;
        row.field = common.field;
        row.messaging_product = common.messaging_product;
        row.display_phone_number = common.display_phone_number;
        row.phone_number_id = common.phone_number_id;
        row.payload_json = common.payload_json;

        rows.push(
            parseStatusColumns({
                row,
                statusObj,
                contact: firstContact,
            })
        );
    }

    return rows;
}