import { pgEnum } from "drizzle-orm/pg-core";

const basicFeedbacksTypesEnum = pgEnum("basic_feedbacks_types", [
    "Bug",
    "Suggestion",
    "Info",
    "Question",
    "Other",
]);

export default basicFeedbacksTypesEnum;