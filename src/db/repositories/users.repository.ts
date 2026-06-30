import { db } from "../connect";
import { authUsers } from "../schemas/auth";
import { profiles } from "../schemas/public";
import { eq } from "drizzle-orm";

const joinProfilesWithAuthUsers = db.select({
    id: authUsers.id,
    canonicalUsername:
    profiles.canonicalUsername,
    username: profiles.username,
    email: authUsers.email
}).from(profiles).leftJoin(authUsers, eq(profiles.id, authUsers.id));

export const getUserById = async (userId: string) => {
    const user = await joinProfilesWithAuthUsers.where(eq(profiles.id, userId)).limit(1);
    return user[0];
}

export const getUserByCanonicalUsername = async (username: string) => {
    const user = await joinProfilesWithAuthUsers.where(eq(profiles.canonicalUsername, username.toLowerCase())).limit(1);
    return user[0];
}

export const getUserByEmail = async (email: string) => {
    const user = await joinProfilesWithAuthUsers.where(eq(authUsers.email, email.toLowerCase())).limit(1);
    return user[0];
}

export const insertProfile = async (id: string, canonicalUsername: string, username: string) => {
    const result = await db.insert(profiles).values({ id, canonicalUsername, username }).returning();
    return result[0];
}