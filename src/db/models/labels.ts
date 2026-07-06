import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const tag = pgTable('tags', {
    id: uuid('id').primaryKey(),
    name: varchar('name', { length: 255 }).unique().notNull(),
});

export const category = pgTable('categories', {
    id: uuid('id').primaryKey(),
    name: varchar('name', { length: 255 }).unique().notNull(),
});

export type Tag = typeof tag.$inferSelect | undefined;
export type Category = typeof category.$inferSelect | undefined;