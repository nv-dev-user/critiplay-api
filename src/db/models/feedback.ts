import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { profile, game } from "@/db";
import basicFeedbackTypesEnum from "@/db/enums/feedbackTypes";

const feedback = pgTable("feedbacks", {
  id: uuid("id").primaryKey(),
  createdBy: uuid("created_by")
    .references(() => profile.id, { onDelete: "cascade" })
    .notNull(),
  gameId: uuid("game_id")
    .references(() => game.id, { onDelete: "cascade" })
    .notNull(),

  label: basicFeedbackTypesEnum("label").notNull(),
  content: text("content").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export default feedback;
export type Feedback = typeof feedback.$inferSelect | undefined;
