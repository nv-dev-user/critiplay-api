import { pgEnum } from "drizzle-orm/pg-core";

export const basicFeedbacksTypesEnum = pgEnum("basic_feedbacks_types", [
    "Bug",
    "Suggestion",
    "Info",
    "Question",
    "Other",
]);
