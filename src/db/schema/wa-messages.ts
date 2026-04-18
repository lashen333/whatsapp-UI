// src\db\schema\wa-messages.ts
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const waMessages = pgTable(
  "wa_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    rawEventId: uuid("raw_event_id"),
    conversationId: text("conversation_id"),
    wamid: text("wamid").notNull().unique(),

    direction: text("direction").notNull(),
    fromNumber: text("from_number"),
    toNumber: text("to_number"),

    waId: text("wa_id"),
    profileName: text("profile_name"),

    messageType: text("message_type"),
    textBody: text("text_body"),
    caption: text("caption"),
    status: text("status"),

    contextMessageId: text("context_message_id"),

    eventTimestamp: timestamp("event_timestamp", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),

    messageJson: jsonb("message_json"),
    statusJson: jsonb("status_json"),
    fullEventJson: jsonb("full_event_json").notNull(),
  },
  (table) => ({
    wamidIdx: index("wa_messages_wamid_idx").on(table.wamid),
    conversationIdIdx: index("wa_messages_conversation_id_idx").on(
      table.conversationId
    ),
    eventTimestampIdx: index("wa_messages_event_timestamp_idx").on(
      table.eventTimestamp
    ),
  })
);