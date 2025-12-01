CREATE TABLE "achievement_reactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"achievement_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"user_name" text,
	"user_image" text,
	"reaction_type" text NOT NULL,
	"content" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"user_name" text,
	"user_image" text,
	"achievement_type" text NOT NULL,
	"achievement_key" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"user_name" text,
	"user_image" text,
	"route_id" uuid NOT NULL,
	"action_type" text NOT NULL,
	"content" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "activity_reactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"user_name" text,
	"user_image" text,
	"reaction_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "personal_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"route_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wall_id" text NOT NULL,
	"grade" text NOT NULL,
	"color" text NOT NULL,
	"setter_name" text NOT NULL,
	"difficulty_label" text,
	"set_date" date NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"attributes" jsonb DEFAULT '[]'::jsonb,
	"setter_notes" text,
	"setter_beta" text,
	"setter_comment" text,
	"style" text,
	"hold_type" text,
	"name" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"removed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "training_plan_routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"route_id" uuid NOT NULL,
	"section_name" text,
	"order_index" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"base_grade" text NOT NULL,
	"length" text NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "upcoming_routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wall_id" text NOT NULL,
	"grade" text NOT NULL,
	"color" text NOT NULL,
	"difficulty_label" text,
	"setter_comment" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"image" text,
	"barcode" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "achievement_reactions" ADD CONSTRAINT "achievement_reactions_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_reactions" ADD CONSTRAINT "activity_reactions_activity_id_activity_logs_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activity_logs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "personal_notes" ADD CONSTRAINT "personal_notes_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_plan_routes" ADD CONSTRAINT "training_plan_routes_plan_id_training_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."training_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_plan_routes" ADD CONSTRAINT "training_plan_routes_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "achievement_reactions_achievement_idx" ON "achievement_reactions" USING btree ("achievement_id");--> statement-breakpoint
CREATE INDEX "achievement_reactions_user_idx" ON "achievement_reactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "achievements_user_idx" ON "achievements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "achievements_key_idx" ON "achievements" USING btree ("achievement_key");--> statement-breakpoint
CREATE INDEX "achievements_user_key_idx" ON "achievements" USING btree ("user_id","achievement_key");--> statement-breakpoint
CREATE INDEX "activity_logs_route_idx" ON "activity_logs" USING btree ("route_id");--> statement-breakpoint
CREATE INDEX "activity_logs_user_idx" ON "activity_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "activity_logs_action_type_idx" ON "activity_logs" USING btree ("action_type");--> statement-breakpoint
CREATE INDEX "activity_reactions_activity_idx" ON "activity_reactions" USING btree ("activity_id");--> statement-breakpoint
CREATE INDEX "activity_reactions_user_idx" ON "activity_reactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "training_plan_routes_plan_idx" ON "training_plan_routes" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "training_plans_user_idx" ON "training_plans" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "training_plans_public_idx" ON "training_plans" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "upcoming_routes_wall_idx" ON "upcoming_routes" USING btree ("wall_id");