import { pgEnum } from "drizzle-orm/pg-core";

const basicFeedbacksTypesEnum = pgEnum("basic_feedbacks_types", [
  "bug",
  "suggestion",
  "other",
]);

export default basicFeedbacksTypesEnum;
