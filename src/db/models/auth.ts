//! THIS FILE IS ABOUT AUTHENTICATION SCHEMA CREATED BY SUPABASE. DO NOT IMPORT IT IN "INDEX.TS" FILE
import { pgSchema, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const authSchema = pgSchema('auth');

export const authUsers = authSchema.table('users', {
    id: uuid('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})