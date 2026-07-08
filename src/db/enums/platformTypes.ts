import { pgEnum } from "drizzle-orm/pg-core";

const platformTypesEnum = pgEnum("platform_types", [
  "windows",
  "macos",
  "linux",
  "android",
  "ios",
]);

export default platformTypesEnum;
