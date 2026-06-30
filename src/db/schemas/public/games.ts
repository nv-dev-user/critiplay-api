import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { categories } from "./labels";
import profiles from "./profiles";
import organizations from "./organizations";

const games = pgTable('games', {
    id: uuid('id').primaryKey().defaultRandom(),

    createdByProfileId: uuid('created_by_profile_id').references(() => profiles.id, { onDelete: "cascade" }),
    createdByOrganizationId: uuid('created_by_organization_id').references(() => organizations.id, { onDelete: "cascade" }),

    title: varchar('title', { length: 255 }).notNull(),
    shortDescription: text('short_description'),
    categoryId: uuid('category_id').notNull().references(() => categories.id),
    version: varchar('version', { length: 32 }).notNull(),

    windows_build_link: text('windows_build_link'),
    mac_build_link: text('mac_build_link'),
    linux_build_link: text('linux_build_link'),
    ios_build_link: text('ios_build_link'),
    android_build_link: text('android_build_link'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export default games;