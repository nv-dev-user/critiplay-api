import { eq } from "drizzle-orm";

import { db } from "@/db/connect";
import { authUsers } from "@/db/models/auth";
import { profile } from "@/db";

const joinProfilesWithAuthUsers = db.select({
    id: authUsers.id,
    canonicalUsername:
    profile.canonicalUsername,
    username: profile.username,
    email: authUsers.email
}).from(profile).leftJoin(authUsers, eq(profile.id, authUsers.id));

export const getUserById = async (userId: string) => {
    const user = await joinProfilesWithAuthUsers.where(eq(profile.id, userId)).limit(1);
    return user[0];
}

export const getUserByCanonicalUsername = async (username: string) => {
    const user = await joinProfilesWithAuthUsers.where(eq(profile.canonicalUsername, username.toLowerCase())).limit(1);
    return user[0];
}

export const getUserByEmail = async (email: string) => {
    const user = await joinProfilesWithAuthUsers.where(eq(authUsers.email, email.toLowerCase())).limit(1);
    return user[0];
}

export const insertProfile = async (id: string, canonicalUsername: string, username: string) => {
    const result = await db.insert(profile).values({ id, canonicalUsername, username }).returning();
    return result[0];
}