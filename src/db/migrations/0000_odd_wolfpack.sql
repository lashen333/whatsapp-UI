CREATE TABLE "wa_contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wa_id" text NOT NULL,
	"phone_number" text,
	"profile_name" text,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wa_contacts_wa_id_unique" UNIQUE("wa_id")
);
--> statement-breakpoint
CREATE TABLE "wa_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" text NOT NULL,
	"customer_wa_id" text,
	"customer_phone" text,
	"customer_name" text,
	"phone_number_id" text,
	"display_phone_number" text,
	"status" text DEFAULT 'open' NOT NULL,
	"latest_message_preview" text,
	"unread_count" integer DEFAULT 0 NOT NULL,
	"last_message_at" timestamp with time zone,
	"last_inbound_at" timestamp with time zone,
	"last_outbound_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wa_conversations_conversation_id_unique" UNIQUE("conversation_id")
);
--> statement-breakpoint
CREATE TABLE "wa_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"raw_event_id" uuid NOT NULL,
	"conversation_id" text,
	"wamid" text NOT NULL,
	"direction" text NOT NULL,
	"from_number" text,
	"to_number" text,
	"wa_id" text,
	"profile_name" text,
	"message_type" text,
	"text_body" text,
	"caption" text,
	"status" text,
	"context_message_id" text,
	"event_timestamp" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"message_json" jsonb,
	"status_json" jsonb,
	"full_event_json" jsonb NOT NULL,
	CONSTRAINT "wa_messages_wamid_unique" UNIQUE("wamid")
);
--> statement-breakpoint
CREATE TABLE "wa_raw_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"webhook_object" text NOT NULL,
	"event_kind" text NOT NULL,
	"direction_guess" text NOT NULL,
	"message_id_guess" text,
	"conversation_id_guess" text,
	"from_number_guess" text,
	"to_number_guess" text,
	"dedupe_key" text NOT NULL,
	"processed" boolean DEFAULT false NOT NULL,
	"payload_json" jsonb NOT NULL,
	CONSTRAINT "wa_raw_events_dedupe_key_unique" UNIQUE("dedupe_key")
);
--> statement-breakpoint
CREATE TABLE "wa_send_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" text,
	"to_number" text NOT NULL,
	"request_json" jsonb NOT NULL,
	"response_json" jsonb,
	"meta_message_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "wa_contacts_wa_id_idx" ON "wa_contacts" USING btree ("wa_id");--> statement-breakpoint
CREATE INDEX "wa_conversations_conversation_id_idx" ON "wa_conversations" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "wa_conversations_customer_phone_idx" ON "wa_conversations" USING btree ("customer_phone");--> statement-breakpoint
CREATE INDEX "wa_conversations_last_message_at_idx" ON "wa_conversations" USING btree ("last_message_at");--> statement-breakpoint
CREATE INDEX "wa_messages_wamid_idx" ON "wa_messages" USING btree ("wamid");--> statement-breakpoint
CREATE INDEX "wa_messages_conversation_id_idx" ON "wa_messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "wa_messages_event_timestamp_idx" ON "wa_messages" USING btree ("event_timestamp");--> statement-breakpoint
CREATE INDEX "wa_raw_events_message_id_idx" ON "wa_raw_events" USING btree ("message_id_guess");--> statement-breakpoint
CREATE INDEX "wa_raw_events_conversation_id_idx" ON "wa_raw_events" USING btree ("conversation_id_guess");--> statement-breakpoint
CREATE INDEX "wa_raw_events_received_at_idx" ON "wa_raw_events" USING btree ("received_at");--> statement-breakpoint
CREATE INDEX "wa_send_requests_meta_message_id_idx" ON "wa_send_requests" USING btree ("meta_message_id");--> statement-breakpoint
CREATE INDEX "wa_send_requests_conversation_id_idx" ON "wa_send_requests" USING btree ("conversation_id");