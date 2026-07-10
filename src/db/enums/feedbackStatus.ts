import { pgEnum } from "drizzle-orm/pg-core";

export const feedbackStatusEnum = pgEnum("feedback_status", [
  "pending",
  "in_progress",
  "resolved",
  "rejected",
  "closed",
  "duplicate",
]);

export default feedbackStatusEnum;
