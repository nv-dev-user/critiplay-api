import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { category, profile, organization } from "@/db";

const game = pgTable('games', {
    id: uuid('id').primaryKey().defaultRandom(),

    createdByProfileId: uuid('created_by_profile_id').references(() => profile.id, { onDelete: "cascade" }),
    createdByOrganizationId: uuid('created_by_organization_id').references(() => organization.id, { onDelete: "cascade" }),

    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    shortDescription: text('short_description'),
    categoryId: uuid('category_id').notNull().references(() => category.id),
    version: varchar('version', { length: 32 }).notNull(),

    windows_build_link: text('windows_build_link'),
    mac_build_link: text('mac_build_link'),
    linux_build_link: text('linux_build_link'),
    ios_build_link: text('ios_build_link'),
    android_build_link: text('android_build_link'),

    is_published: boolean('is_published').notNull().default(false),
    are_tests_enabled: boolean('are_tests_enabled').notNull().default(false),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export default game;
export type Game = typeof game.$inferSelect;