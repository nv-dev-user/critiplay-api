import { pgTable, uuid } from "drizzle-orm/pg-core";
import game from "./game";
import profile from "./profile";

export const profile_game = pgTable(
  "profile_game",
  {
    gameId: uuid("game_id")
      .references(() => game.id, { onDelete: "cascade" })
      .notNull(),
    profileId: uuid("profile_id")
      .references(() => profile.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [
    {
      pk: [table.gameId, table.profileId],
    },
  ],
);
