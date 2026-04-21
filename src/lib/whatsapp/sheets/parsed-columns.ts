export type WhatsAppParsedSheetRow = {
    row_id: string;
    received_at: string;

    object: string;
    entry_id: string;
    field: string;
    messaging_product: string;
    display_phone_number: string;
    phone_number_id: string;

    event_type: string;
    direction: string;

    contact_wa_id: string;
    contact_user_id: string;
    profile_name: string;

    message_id: string;
    status_message_id: string;
    context_message_id: string;
    recipient_id: string;
    recipient_user_id: string;

    timestamp: string;
    message_type: string;
    text_body: string;

    image_id: string;
    image_mime_type: string;
    image_sha256: string;
    image_caption: string;

    document_id: string;
    document_mime_type: string;
    document_sha256: string;
    document_filename: string;
    document_caption: string;

    audio_id: string;
    audio_mime_type: string;
    audio_sha256: string;
    audio_voice: string;

    video_id: string;
    video_mime_type: string;
    video_sha256: string;
    video_caption: string;

    sticker_id: string;
    sticker_mime_type: string;
    sticker_sha256: string;
    sticker_animated: string;

    button_text: string;
    interactive_type: string;
    button_reply_id: string;
    button_reply_title: string;
    list_reply_id: string;
    list_reply_title: string;

    location_latitude: string;
    location_longitude: string;
    location_name: string;
    location_address: string;

    conversation_id: string;
    conversation_origin_type: string;
    conversation_expiration_timestamp: string;

    pricing_billable: string;
    pricing_category: string;
    pricing_model: string;

    status: string;
    error_code: string;
    error_title: string;
    error_message: string;
    error_details: string;
    error_href: string;

    payload_json: string;
};

export const WHATSAPP_PARSED_SHEET_HEADERS: (keyof WhatsAppParsedSheetRow)[] = [
    "row_id",
    "received_at",
    "object",
    "entry_id",
    "field",
    "messaging_product",
    "display_phone_number",
    "phone_number_id",
    "event_type",
    "direction",
    "contact_wa_id",
    "contact_user_id",
    "profile_name",
    "message_id",
    "status_message_id",
    "context_message_id",
    "recipient_id",
    "recipient_user_id",
    "timestamp",
    "message_type",
    "text_body",
    "image_id",
    "image_mime_type",
    "image_sha256",
    "image_caption",
    "document_id",
    "document_mime_type",
    "document_sha256",
    "document_filename",
    "document_caption",
    "audio_id",
    "audio_mime_type",
    "audio_sha256",
    "audio_voice",
    "video_id",
    "video_mime_type",
    "video_sha256",
    "video_caption",
    "sticker_id",
    "sticker_mime_type",
    "sticker_sha256",
    "sticker_animated",
    "button_text",
    "interactive_type",
    "button_reply_id",
    "button_reply_title",
    "list_reply_id",
    "list_reply_title",
    "location_latitude",
    "location_longitude",
    "location_name",
    "location_address",
    "conversation_id",
    "conversation_origin_type",
    "conversation_expiration_timestamp",
    "pricing_billable",
    "pricing_category",
    "pricing_model",
    "status",
    "error_code",
    "error_title",
    "error_message",
    "error_details",
    "error_href",
    "payload_json",
];