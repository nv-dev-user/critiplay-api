import { pgEnum } from "drizzle-orm/pg-core";

const severityTypesEnum = pgEnum("severity_types", [
  "critical",
  "major",
  "minor",
  "info",
]);

export default severityTypesEnum;
