import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import profiles from "./profiles";
import games from "./games";
import { basicFeedbacksTypesEnum } from "./feedbacks_enum";

const feedbacks = pgTable("feedbacks", {
    id: uuid("id").primaryKey(),
    createdBy: uuid("created_by").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
    gameId: uuid("game_id").references(() => games.id, { onDelete: "cascade" }).notNull(),

    label: basicFeedbacksTypesEnum("label").notNull(),
    content: text("content").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
})

export default feedbacks;