CREATE TABLE "custom_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"url" varchar(500) NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "tools" ALTER COLUMN "logo_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "pricing_info" text;--> statement-breakpoint
ALTER TABLE "tools" ADD COLUMN "company" varchar(200);--> statement-breakpoint
ALTER TABLE "custom_links" ADD CONSTRAINT "custom_links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "custom_links_user_idx" ON "custom_links" USING btree ("user_id");