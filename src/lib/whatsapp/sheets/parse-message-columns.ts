import { AnyRecord, asRecord, getBooleanString, getNumberString, getString } from "@/lib/whatsapp/sheets/parser-utils";
import { WhatsAppParsedSheetRow } from "@/lib/whatsapp/sheets/parsed-columns";

type ParseMessageColumnsInput = {
    row: WhatsAppParsedSheetRow;
    message: AnyRecord;
    contact: AnyRecord | null;
};

export function parseMessageColumns({
    row,
    message,
    contact,
}: ParseMessageColumnsInput): WhatsAppParsedSheetRow {
    const text = asRecord(message.text);
    const image = asRecord(message.image);
    const document = asRecord(message.document);
    const audio = asRecord(message.audio);
    const video = asRecord(message.video);
    const sticker = asRecord(message.sticker);
    const button = asRecord(message.button);
    const interactive = asRecord(message.interactive);
    const buttonReply = asRecord(interactive?.button_reply);
    const listReply = asRecord(interactive?.list_reply);
    const location = asRecord(message.location);
    const context = asRecord(message.context);
    const profile = asRecord(contact?.profile);

    row.event_type = "message";
    row.direction = "inbound";

    row.contact_wa_id = getString(contact?.wa_id);
    row.contact_user_id = getString(contact?.user_id);
    row.profile_name = getString(profile?.name);

    row.message_id = getString(message.id);
    row.context_message_id = getString(context?.id);
    row.timestamp = getString(message.timestamp);
    row.message_type = getString(message.type);
    row.text_body = getString(text?.body);

    row.image_id = getString(image?.id);
    row.image_mime_type = getString(image?.mime_type);
    row.image_sha256 = getString(image?.sha256);
    row.image_caption = getString(image?.caption);

    row.document_id = getString(document?.id);
    row.document_mime_type = getString(document?.mime_type);
    row.document_sha256 = getString(document?.sha256);
    row.document_filename = getString(document?.filename);
    row.document_caption = getString(document?.caption);

    row.audio_id = getString(audio?.id);
    row.audio_mime_type = getString(audio?.mime_type);
    row.audio_sha256 = getString(audio?.sha256);
    row.audio_voice = getBooleanString(audio?.voice);

    row.video_id = getString(video?.id);
    row.video_mime_type = getString(video?.mime_type);
    row.video_sha256 = getString(video?.sha256);
    row.video_caption = getString(video?.caption);

    row.sticker_id = getString(sticker?.id);
    row.sticker_mime_type = getString(sticker?.mime_type);
    row.sticker_sha256 = getString(sticker?.sha256);
    row.sticker_animated = getBooleanString(sticker?.animated);

    row.button_text = getString(button?.text);
    row.interactive_type = getString(interactive?.type);
    row.button_reply_id = getString(buttonReply?.id);
    row.button_reply_title = getString(buttonReply?.title);
    row.list_reply_id = getString(listReply?.id);
    row.list_reply_title = getString(listReply?.title);

    row.location_latitude = getNumberString(location?.latitude);
    row.location_longitude = getNumberString(location?.longitude);
    row.location_name = getString(location?.name);
    row.location_address = getString(location?.address);

    return row;
}