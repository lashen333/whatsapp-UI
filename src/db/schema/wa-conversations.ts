// src\db\schema\wa-conversations.ts
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const waConversations = pgTable(
  "wa_conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    conversationId: text("conversation_id").notNull().unique(),

    customerWaId: text("customer_wa_id"),
    customerPhone: text("customer_phone"),
    customerName: text("customer_name"),

    phoneNumberId: text("phone_number_id"),
    displayPhoneNumber: text("display_phone_number"),

    status: text("status").default("open").notNull(),
    latestMessagePreview: text("latest_message_preview"),
    unreadCount: integer("unread_count").default(0).notNull(),

    lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
    lastInboundAt: timestamp("last_inbound_at", { withTimezone: true }),
    lastOutboundAt: timestamp("last_outbound_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    conversationIdIdx: index("wa_conversations_conversation_id_idx").on(
      table.conversationId
    ),
    customerPhoneIdx: index("wa_conversations_customer_phone_idx").on(
      table.customerPhone
    ),
    lastMessageAtIdx: index("wa_conversations_last_message_at_idx").on(
      table.lastMessageAt
    ),
  })
);