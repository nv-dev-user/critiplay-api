import { eq } from "drizzle-orm";

import { tag } from "@/db";
import { db } from "@/db/connect";

export const getTagById = async (id: string) => {
    const tagById = await db.select().from(tag).where(eq(tag.id, id)).limit(1);
    return tagById[0];
}

export const getTagByName = async (name: string) => {
    const tagByName = await db.select().from(tag).where(eq(tag.name, name)).limit(1);
    return tagByName[0];
}