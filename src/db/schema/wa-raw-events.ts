// src\db\schema\wa-raw-events.ts
//raw schema

import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const waRawEvents = pgTable(
  "wa_raw_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    receivedAt: timestamp("received_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    webhookObject: text("webhook_object").notNull(),
    eventKind: text("event_kind").notNull(),
    directionGuess: text("direction_guess").notNull(),

    messageIdGuess: text("message_id_guess"),
    conversationIdGuess: text("conversation_id_guess"),
    fromNumberGuess: text("from_number_guess"),
    toNumberGuess: text("to_number_guess"),

    dedupeKey: text("dedupe_key").notNull().unique(),
    processed: boolean("processed").default(false).notNull(),

    payloadJson: jsonb("payload_json").notNull(),
  },
  (table) => ({
    messageIdIdx: index("wa_raw_events_message_id_idx").on(table.messageIdGuess),
    conversationIdIdx: index("wa_raw_events_conversation_id_idx").on(
      table.conversationIdGuess
    ),
    receivedAtIdx: index("wa_raw_events_received_at_idx").on(table.receivedAt),
  })
);