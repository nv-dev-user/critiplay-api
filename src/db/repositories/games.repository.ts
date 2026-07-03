import slugify from "@sindresorhus/slugify";
import type { SQL} from "drizzle-orm";
import { eq, and, or, inArray, ilike, desc } from "drizzle-orm";

import { game_tag, game } from "@/db";
import { db } from "@/db/connect";

export const getGameBySlug = async (slug: string) => {
    const gameBySlug = await db.select().from(game).where(eq(game.slug, slug)).limit(1);
    return gameBySlug[0];
}

export const insertGame = async (
    title: string,
    version: string,
    categoryId: string,
    shortDescription: string,
    createdByProfile: string = '',
    createdByOrganization: string = ''
) => {
    const result = await db.insert(game).values({
        title,
        slug: slugify(title),
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

export const getGamesByFilters = async (
    filters: {
        partialTitle?: string,
        categoryId?: string,
        tagIds?: string[],
        ownerIds?: string[]
    },
    limit: number,
    offset: number
) => {
    const conditions: (SQL | undefined)[] = [];

    if (filters.partialTitle) {
        const escapedPartialTitle = filters.partialTitle.replace(/[\\%_]/g, '\\$&'); // Escape % and _ characters
        conditions.push(ilike(game.title, `%${escapedPartialTitle}%`));
    }

    if (filters.categoryId) {
        conditions.push(eq(game.categoryId, filters.categoryId));
    }

    if (filters.ownerIds && filters.ownerIds.length > 0) {
        conditions.push(or(
            inArray(game.createdByProfileId, filters.ownerIds),
            inArray(game.createdByOrganizationId, filters.ownerIds)
        ));
    }

    if (filters.tagIds && filters.tagIds.length > 0) {
        const gameIdsWithTags = await db.select({ gameId: game_tag.gameId })
            .from(game_tag)
            .where(inArray(game_tag.tagId, filters.tagIds));

        const gameIds = gameIdsWithTags.map(row => row.gameId);

        if (gameIds.length > 0) {
            conditions.push(inArray(game.id, gameIds));
        }
    }

    const gamesList = await db
        .select()
        .from(game)
        .where(
            and(
                ...conditions,
                eq(game.is_published, true)
            )
        ).orderBy(desc(game.updatedAt)).limit(limit).offset(offset);

    return gamesList;
}