import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import feedbackStatusEnum from "../enums/feedbackStatus";
import platformTypesEnum from "../enums/platformTypes";
import severityTypesEnum from "../enums/severityTypes";
import { profile, game } from "@/db";
import basicFeedbackTypesEnum from "@/db/enums/feedbackTypes";

const feedback = pgTable("feedbacks", {
  id: uuid("id").primaryKey(),
  profileId: uuid("profile_id")
    .references(() => profile.id, { onDelete: "cascade" })
    .notNull(),
  gameId: uuid("game_id")
    .references(() => game.id, { onDelete: "cascade" })
    .notNull(),

  content: text("content").notNull(),

  type: basicFeedbackTypesEnum("type").notNull(), // Bug, Suggestion, Improvement, Other, ...
  severity: severityTypesEnum("severity").notNull(), // Critical, Major, Minor, Info

  platforms: platformTypesEnum("platforms").array().notNull(), // Windows, MacOS, Linux, Android, iOS

  status: feedbackStatusEnum("status").notNull().default("pending"), // pending, reviewed, resolved, rejected

  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export default feedback;
export type Feedback = typeof feedback.$inferSelect | undefined;
