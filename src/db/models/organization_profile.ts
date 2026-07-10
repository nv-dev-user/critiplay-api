import { pgTable, uuid } from "drizzle-orm/pg-core";
import organization from "./organization";
import profile from "./profile";
import organizationRoleTypesEnum from "@/db/enums/organizationRoles";

const organization_profile = pgTable(
  "organization_profile",
  {
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profile.id, { onDelete: "cascade" }),
    role: organizationRoleTypesEnum("role").notNull(),
  },
  (table) => [
    {
      pk: [table.organizationId, table.profileId],
    },
  ],
);

export default organization_profile;
export type OrganizationProfile =
  typeof organization_profile.$inferSelect | undefined;
