import { pgEnum } from "drizzle-orm/pg-core";

const organizationRoleTypesEnum = pgEnum("organization_role_types", [
  "owner",
  "admin",
  "dev",
  "tester",
]);

export default organizationRoleTypesEnum;
export type OrganizationRoleTypes =
  (typeof organizationRoleTypesEnum.enumValues)[number];
