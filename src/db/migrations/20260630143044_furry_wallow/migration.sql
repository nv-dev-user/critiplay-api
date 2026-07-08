CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"canonical_username" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	CONSTRAINT "profiles_canonical_username_unique" UNIQUE("canonical_username")
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;