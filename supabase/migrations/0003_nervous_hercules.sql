CREATE TABLE "games" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_by_profile_id" uuid NOT NULL,
	"created_by_organization_id" uuid,
	"title" varchar(255) NOT NULL,
	"short_description" text NOT NULL,
	"category_id" uuid NOT NULL,
	"version" varchar(32) NOT NULL,
	"windows_build_link" text,
	"mac_build_link" text,
	"linux_build_link" text,
	"ios_build_link" text,
	"android_build_link" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_created_by_profile_id_profiles_id_fk" FOREIGN KEY ("created_by_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_created_by_organization_id_organizations_id_fk" FOREIGN KEY ("created_by_organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;