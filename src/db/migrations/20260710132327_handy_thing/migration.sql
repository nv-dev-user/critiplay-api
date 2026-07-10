CREATE TABLE "profile_game" (
	"game_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile_game" ADD CONSTRAINT "profile_game_game_id_games_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "profile_game" ADD CONSTRAINT "profile_game_profile_id_profiles_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE;