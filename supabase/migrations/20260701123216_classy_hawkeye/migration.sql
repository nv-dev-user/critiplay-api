ALTER TABLE "games" ADD COLUMN "is_published" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "games" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;