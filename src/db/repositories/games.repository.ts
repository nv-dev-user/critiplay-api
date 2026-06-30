import { eq, SQL, and } from "drizzle-orm";
import { db } from "../connect";
import { games } from "../schemas/public";

export const getGameByTitle = async (title: string) => {
    const game = await db.select().from(games).where(eq(games.title, title)).limit(1);
    return game[0];
}

export const insertGame = async (
    title: string,
    version: string,
    categoryId: string,
    shortDescription: string,
    createdByProfile: string = '',
    createdByOrganization: string = ''
) => {
    const result = await db.insert(games).values({
        title,
        version,
        categoryId,
        shortDescription,
        createdByProfileId: createdByProfile || null,
        createdByOrganizationId: createdByOrganization || null,
        createdAt: new Date(),
        updatedAt: new Date()
    }).returning();
    return result[0];
}

export const getGameByFilters = async (filters: { title?: string; version?: string; categoryId?: string, tags?: string[] }) => {
    const conditions: SQL[] = [];

    if (filters.title) {
        conditions.push(eq(games.title, filters.title));
    }

    if (filters.version) {
        conditions.push(eq(games.version, filters.version));
    }

    if (filters.categoryId) {
        conditions.push(eq(games.categoryId, filters.categoryId));
    }

    if (filters.tags && filters.tags.length > 0) {
        // Assuming you have a separate table for game tags and a relationship between games and tags
        // You would need to join that table and filter based on the provided tags.
        // This is a placeholder for the actual implementation.
        // conditions.push(...); // Add your tag filtering logic here
    }

    let query = db.select().from(games).where(and(...conditions));

    return await query;
}