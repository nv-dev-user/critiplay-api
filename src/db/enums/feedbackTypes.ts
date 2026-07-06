import { pgEnum } from "drizzle-orm/pg-core";

const basicFeedbacksTypesEnum = pgEnum("basic_feedbacks_types", [
  "bug",
  "suggestion",
  "info",
  "question",
  "other",
]);

export default basicFeedbacksTypesEnum;
