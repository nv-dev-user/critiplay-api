CREATE TYPE "feedback_status" AS ENUM('pending', 'reviewed', 'resolved', 'rejected');--> statement-breakpoint
CREATE TYPE "platform_types" AS ENUM('windows', 'macos', 'linux', 'android', 'ios');--> statement-breakpoint
CREATE TYPE "severity_types" AS ENUM('critical', 'major', 'minor', 'info');--> statement-breakpoint
ALTER TABLE "feedbacks" RENAME COLUMN "created_by" TO "profile_id";--> statement-breakpoint
ALTER TABLE "feedbacks" RENAME COLUMN "label" TO "type";--> statement-breakpoint
ALTER TABLE "feedbacks" ADD COLUMN "severity" "severity_types" NOT NULL;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD COLUMN "platforms" "platform_types"[] NOT NULL;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD COLUMN "status" "feedback_status" DEFAULT 'pending'::"feedback_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "feedbacks" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "basic_feedbacks_types";--> statement-breakpoint
CREATE TYPE "basic_feedbacks_types" AS ENUM('bug', 'suggestion', 'other');--> statement-breakpoint
ALTER TABLE "feedbacks" ALTER COLUMN "type" SET DATA TYPE "basic_feedbacks_types" USING "type"::"basic_feedbacks_types";--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "slug_version_index" UNIQUE("slug","version");