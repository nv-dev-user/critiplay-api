import { pgTable, uuid } from "drizzle-orm/pg-core";
import organization from "./organization";
import organizationRoleTypesEnum from "@/db/enums/organizationRoles";

const organization_profile = pgTable(
  "organization_profile",
  {
    organization: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    profile: uuid("profile_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    role: organizationRoleTypesEnum("role").notNull(),
  },
  (table) => [
    {
      pk: [table.organization, table.profile],
    },
  ],
);

export default organization_profile;
export type OrganizationProfile =
  typeof organization_profile.$inferSelect | undefined;
