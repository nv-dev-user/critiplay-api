import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schemas/public",
  out: "./supabase/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
});