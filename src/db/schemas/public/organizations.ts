import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const organizations = pgTable('organizations', {
    id: uuid('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull()
});

export default organizations;