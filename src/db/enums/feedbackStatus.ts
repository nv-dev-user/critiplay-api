import { pgEnum } from "drizzle-orm/pg-core";

export const feedbackStatusEnum = pgEnum("feedback_status", [
  "pending",
  "reviewed",
  "resolved",
  "rejected",
]);

export default feedbackStatusEnum;
