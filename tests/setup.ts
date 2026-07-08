import { createClient } from "@supabase/supabase-js";

if (process.env.SUPABASE_URL === undefined) {
  throw new Error("SUPABASE_URL is not defined in the environment variables.");
}

if (process.env.SUPABASE_SECRET_KEY === undefined) {
  throw new Error(
    "SUPABASE_SECRET_KEY is not defined in the environment variables.",
  );
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } },
);
