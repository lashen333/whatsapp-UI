import { AnyRecord, asRecord, getBooleanString, getString } from "@/lib/whatsapp/sheets/parser-utils";
import { WhatsAppParsedSheetRow } from "@/lib/whatsapp/sheets/parsed-columns";

type ParseStatusColumnsInput = {
    row: WhatsAppParsedSheetRow;
    statusObj: AnyRecord;
    contact: AnyRecord | null;
};

export function parseStatusColumns({
    row,
    statusObj,
    contact,
}: ParseStatusColumnsInput): WhatsAppParsedSheetRow {
    const conversation = asRecord(statusObj.conversation);
    const conversationOrigin = asRecord(conversation?.origin);
    const pricing = asRecord(statusObj.pricing);

    const errors = Array.isArray(statusObj.errors) ? statusObj.errors : [];
    const firstError = asRecord(errors[0]);
    const errorData = asRecord(firstError?.error_data);

    row.event_type = "status";
    row.direction = "outbound";

    row.contact_wa_id = getString(contact?.wa_id);
    row.contact_user_id = getString(contact?.user_id);

    row.status_message_id = getString(statusObj.id);
    row.status = getString(statusObj.status);
    row.timestamp = getString(statusObj.timestamp);
    row.recipient_id = getString(statusObj.recipient_id);
    row.recipient_user_id = getString(statusObj.recipient_user_id);

    row.conversation_id = getString(conversation?.id);
    row.conversation_origin_type = getString(conversationOrigin?.type);
    row.conversation_expiration_timestamp = getString(
        conversation?.expiration_timestamp
    );

    row.pricing_billable = getBooleanString(pricing?.billable);
    row.pricing_category = getString(pricing?.category);
    row.pricing_model = getString(pricing?.pricing_model);

    row.error_code = getString(firstError?.code);
    row.error_title = getString(firstError?.title);
    row.error_message = getString(firstError?.message);
    row.error_details = getString(errorData?.details);
    row.error_href = getString(firstError?.href);

    return row;
}