CREATE TYPE "public"."category_type" AS ENUM('image_generation', 'music_generation', 'ai_coding', 'chat', 'relay_station', 'ai_tools', 'other');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"region_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"type" "category_type" NOT NULL,
	"icon" varchar(255),
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"tool_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "frequent_tools" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"tool_id" integer NOT NULL,
	"use_count" integer DEFAULT 1,
	"last_used_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "regions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sms_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" varchar(20) NOT NULL,
	"code" varchar(10) NOT NULL,
	"is_used" boolean DEFAULT false,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tools" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"description" text,
	"url" varchar(500) NOT NULL,
	"logo_url" varchar(500),
	"tags" text[],
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"view_count" integer DEFAULT 0,
	"sort_order" integer DEFAULT 0,
	"created_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "tools_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" varchar(20) NOT NULL,
	"password_hash" varchar(255),
	"nickname" varchar(100),
	"avatar_url" varchar(500),
	"role" "user_role" DEFAULT 'user',
	"is_active" boolean DEFAULT true,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_tool_id_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "frequent_tools" ADD CONSTRAINT "frequent_tools_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "frequent_tools" ADD CONSTRAINT "frequent_tools_tool_id_tools_id_fk" FOREIGN KEY ("tool_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tools" ADD CONSTRAINT "tools_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tools" ADD CONSTRAINT "tools_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_region_slug_idx" ON "categories" USING btree ("region_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_user_tool_idx" ON "favorites" USING btree ("user_id","tool_id");--> statement-breakpoint
CREATE UNIQUE INDEX "frequent_tools_user_tool_idx" ON "frequent_tools" USING btree ("user_id","tool_id");--> statement-breakpoint
CREATE INDEX "sms_codes_phone_idx" ON "sms_codes" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "tools_category_idx" ON "tools" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "tools_active_idx" ON "tools" USING btree ("is_active");