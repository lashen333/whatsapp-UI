// src\db\index.ts
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as waRawEvents from "@/db/schema/wa-raw-events";
import * as waConversations from "@/db/schema/wa-conversations";
import * as waMessages from "@/db/schema/wa-messages";
import * as waContacts from "@/db/schema/wa-contacts";
import * as waSendRequests from "@/db/schema/wa-send-requests";
import { env } from "@/lib/env";

const client = postgres(env.DATABASE_URL, {
  prepare: false,
});

export const db = drizzle(client, {
  schema: {
    ...waRawEvents,
    ...waConversations,
    ...waMessages,
    ...waContacts,
    ...waSendRequests,
  },
});