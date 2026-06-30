import { pgTable, uuid } from "drizzle-orm/pg-core";
import { tags } from "./labels";
import games from "./games";

const game_tag = pgTable('game_tag', {
    gameId: uuid('game_id').notNull().references(() => games.id, { onDelete: "cascade" }),
    tagId: uuid('tag_id').notNull().references(() => tags.id, { onDelete: "cascade" }),
}, (table) => ([
    {
        pk: [table.gameId, table.tagId],
    }
]));

export default game_tag;