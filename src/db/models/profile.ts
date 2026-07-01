import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { authUsers } from "@/db/models/auth";

const profile = pgTable('profiles', {
    id: uuid('id').primaryKey().references(() => authUsers.id, { onDelete: 'cascade' }),
    canonicalUsername: varchar('canonical_username', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 255 }).notNull(),
});

export default profile;
export type Profile = typeof profile.$inferSelect;