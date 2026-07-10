import {
  boolean,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
  integer,
} from "drizzle-orm/pg-core";

import { category, profile, organization } from "@/db";

const game = pgTable(
  "games",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    slug: varchar("slug", { length: 255 }).notNull().unique(),
    version: varchar("version", { length: 32 }).notNull(),

    downloadCount: integer("download_count").notNull().default(0),
    createdByProfileId: uuid("created_by_profile_id").references(
      () => profile.id,
      { onDelete: "cascade" },
    ),
    createdByOrganizationId: uuid("created_by_organization_id").references(
      () => organization.id,
      { onDelete: "cascade" },
    ),

    title: varchar("title", { length: 255 }).notNull(),
    shortDescription: text("short_description"),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => category.id),

    windowsBuildLink: text("windows_build_link"),
    macBuildLink: text("mac_build_link"),
    linuxBuildLink: text("linux_build_link"),
    iosBuildLink: text("ios_build_link"),
    androidBuildLink: text("android_build_link"),

    isPublished: boolean("is_published").notNull().default(false),
    areTestsEnabled: boolean("are_tests_enabled").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [unique("slug_version_index").on(table.slug, table.version)],
);

export default game;
export type Game = typeof game.$inferSelect | undefined;
