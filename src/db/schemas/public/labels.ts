import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const tags = pgTable('tags', {
    id: uuid('id').primaryKey(),
    name: varchar('name', { length: 255 }).unique().notNull(),
});

export const categories = pgTable('categories', {
    id: uuid('id').primaryKey(),
    name: varchar('name', { length: 255 }).unique().notNull(),
});