import { pgTable, uuid } from "drizzle-orm/pg-core";

import { tag, game } from "@/db";

const game_tag = pgTable('game_tag', {
    gameId: uuid('game_id').notNull().references(() => game.id, { onDelete: "cascade" }),
    tagId: uuid('tag_id').notNull().references(() => tag.id, { onDelete: "cascade" }),
}, (table) => ([
    {
        pk: [table.gameId, table.tagId],
    }
]));

export default game_tag;