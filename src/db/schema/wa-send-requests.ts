// src\db\schema\wa-send-requests.ts
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const waSendRequests = pgTable(
  "wa_send_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    conversationId: text("conversation_id"),
    toNumber: text("to_number").notNull(),

    requestJson: jsonb("request_json").notNull(),
    responseJson: jsonb("response_json"),

    metaMessageId: text("meta_message_id"),
    status: text("status").default("pending").notNull(),

    createdBy: text("created_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    metaMessageIdIdx: index("wa_send_requests_meta_message_id_idx").on(
      table.metaMessageId
    ),
    conversationIdIdx: index("wa_send_requests_conversation_id_idx").on(
      table.conversationId
    ),
  })
);