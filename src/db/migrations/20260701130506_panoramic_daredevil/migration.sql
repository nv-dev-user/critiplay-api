CREATE TYPE "organization_role_types" AS ENUM('owner', 'admin', 'dev', 'tester');--> statement-breakpoint
CREATE TABLE "organization_profile" (
	"organization_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"role" "organization_role_types" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedbacks" ALTER COLUMN "label" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "basic_feedbacks_types";--> statement-breakpoint
CREATE TYPE "basic_feedbacks_types" AS ENUM('bug', 'suggestion', 'info', 'question', 'other');--> statement-breakpoint
ALTER TABLE "feedbacks" ALTER COLUMN "label" SET DATA TYPE "basic_feedbacks_types" USING "label"::"basic_feedbacks_types";--> statement-breakpoint
ALTER TABLE "organization_profile" ADD CONSTRAINT "organization_profile_organization_id_organizations_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "organization_profile" ADD CONSTRAINT "organization_profile_profile_id_organizations_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "organizations"("id") ON DELETE CASCADE;