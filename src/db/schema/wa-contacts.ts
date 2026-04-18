// src\db\schema\wa-contacts.ts
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const waContacts = pgTable(
  "wa_contacts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    waId: text("wa_id").notNull().unique(),
    phoneNumber: text("phone_number"),
    profileName: text("profile_name"),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).defaultNow().notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    waIdIdx: index("wa_contacts_wa_id_idx").on(table.waId),
  })
);