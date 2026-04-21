import { v4 as uuidv4 } from "uuid";
import { WhatsAppParsedSheetRow } from "@/lib/whatsapp/sheets/parsed-columns";
import { asRecord, getString, getUnknownAsJson } from "@/lib/whatsapp/sheets/parser-utils";

export function createEmptyParsedRow(): WhatsAppParsedSheetRow {
    return {
        row_id: uuidv4(),
        received_at: new Date().toISOString(),

        object: "",
        entry_id: "",
        field: "",
        messaging_product: "",
        display_phone_number: "",
        phone_number_id: "",

        event_type: "",
        direction: "",

        contact_wa_id: "",
        contact_user_id: "",
        profile_name: "",

        message_id: "",
        status_message_id: "",
        context_message_id: "",
        recipient_id: "",
        recipient_user_id: "",

        timestamp: "",
        message_type: "",
        text_body: "",

        image_id: "",
        image_mime_type: "",
        image_sha256: "",
        image_caption: "",

        document_id: "",
        document_mime_type: "",
        document_sha256: "",
        document_filename: "",
        document_caption: "",

        audio_id: "",
        audio_mime_type: "",
        audio_sha256: "",
        audio_voice: "",

        video_id: "",
        video_mime_type: "",
        video_sha256: "",
        video_caption: "",

        sticker_id: "",
        sticker_mime_type: "",
        sticker_sha256: "",
        sticker_animated: "",

        button_text: "",
        interactive_type: "",
        button_reply_id: "",
        button_reply_title: "",
        list_reply_id: "",
        list_reply_title: "",

        location_latitude: "",
        location_longitude: "",
        location_name: "",
        location_address: "",

        conversation_id: "",
        conversation_origin_type: "",
        conversation_expiration_timestamp: "",

        pricing_billable: "",
        pricing_category: "",
        pricing_model: "",

        status: "",
        error_code: "",
        error_title: "",
        error_message: "",
        error_details: "",
        error_href: "",

        payload_json: "",
    };
}

export function parseCommonColumns(payload: unknown) {
    const root = asRecord(payload);
    const entry = Array.isArray(root?.entry) ? asRecord(root.entry[0]) : null;
    const changes = Array.isArray(entry?.changes) ? asRecord(entry.changes[0]) : null;
    const value = asRecord(changes?.value);
    const metadata = asRecord(value?.metadata);

    return {
        object: getString(root?.object),
        entry_id: getString(entry?.id),
        field: getString(changes?.field),
        messaging_product: getString(value?.messaging_product),
        display_phone_number: getString(metadata?.display_phone_number),
        phone_number_id: getString(metadata?.phone_number_id),
        payload_json: getUnknownAsJson(payload),
        value,
    };
}