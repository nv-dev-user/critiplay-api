import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { authUsers } from "../auth";

const profiles = pgTable('profiles', {
    id: uuid('id').primaryKey().references(() => authUsers.id, { onDelete: 'cascade' }),
    canonicalUsername: varchar('canonical_username', { length: 255 }).notNull().unique(),
    username: varchar('username', { length: 255 }).notNull(),
});

export default profiles;