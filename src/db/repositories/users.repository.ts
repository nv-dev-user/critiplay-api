import { eq } from "drizzle-orm";

import type { Profile } from "../models/profile";
import { profile } from "@/db";
import { db } from "@/db/connect";
import { authUsers } from "@/db/models/auth";

const baseUserQuery = () =>
  db
    .select({
      id: authUsers.id,
      canonicalUsername: profile.canonicalUsername,
      username: profile.username,
      email: authUsers.email,
    })
    .from(profile)
    .leftJoin(authUsers, eq(profile.id, authUsers.id));

export const getUserById = async (
  userId: string,
): Promise<User | undefined> => {
  const user = await baseUserQuery().where(eq(profile.id, userId)).limit(1);
  return user[0];
};

export const getUserByCanonicalUsername = async (
  username: string,
): Promise<User | undefined> => {
  const user = await baseUserQuery()
    .where(eq(profile.canonicalUsername, username.toLowerCase()))
    .limit(1);
  return user[0];
};

export const getUserByEmail = async (
  email: string,
): Promise<User | undefined> => {
  const user = await baseUserQuery()
    .where(eq(authUsers.email, email.toLowerCase()))
    .limit(1);
  return user[0];
};

export const insertProfile = async (
  id: string,
  canonicalUsername: string,
  username: string,
): Promise<Profile | undefined> => {
  const result = await db
    .insert(profile)
    .values({ id, canonicalUsername, username })
    .returning();
  return result[0];
};
