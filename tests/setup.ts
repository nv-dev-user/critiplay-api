import { createClient } from "@supabase/supabase-js";
import { beforeAll } from "vitest";

import { profile } from "../src/db";
import { db } from "../src/db/connect";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

beforeAll(async () => {
  const users = [
    { email: "test1@test.com", username: "Test1", password: "password" },
    { email: "test2@test.com", username: "Test2", password: "password" },
    { email: "test3@test.com", username: "Test3", password: "password" },
  ];

  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    if (error) {
      if (error.code === "email_exists") {
        console.warn(`User ${user.email} already exists. SKIPPED.`);
        continue;
      } else {
        console.error(`Error creating user ${user.email}:`, error);
        throw error;
      }
    }

    try {
      await db.insert(profile).values({
        id: data.user.id,
        canonicalUsername: user.username.toLowerCase(),
        username: user.username,
      });
    } catch (error: any) {
      if (error.code === "23505") {
        console.warn(`Profile for user ${user.email} already exists. SKIPPED.`);
      } else {
        console.error(`Error inserting profile for user ${user.email}:`, error);
        throw error;
      }
    }
  }
});
