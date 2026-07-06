import type { Context} from "hono";
import { Hono } from "hono";

import type { Game } from "@/db/models/game";
import { deleteGameBySlug, getGameBySlug, getGamesByFilters } from "@/db/repositories/games.repository";
import { getUserRoleInOrganization } from "@/db/repositories/organization_profile.repository";
import { getOrganizationById } from "@/db/repositories/organizations.repository";
import { getUserById } from "@/db/repositories/users.repository";
import type { Env } from "@/index";


const game = new Hono().basePath('/game');

//* Send the game data based on the slug provided in the URL
export const gameHandler = async (c: Context<Env>) => {
    const { gameSlug } = c.req.param();
    const game = await getGameBySlug(gameSlug);
    return c.json({ game: game }, game ? 200 : 404);
}

//* Send a list of games based on the provided filters in the query parameters
export const gameListHandler = async (c: Context<Env>) => {
    const {
        partialTitle = '',
        categoryId = '',
        ownerIds = [],
        tagIds = [],
        limit = 25,
        offset = 0
    }: {
        partialTitle?: string,
        categoryId?: string,
        ownerIds?: string[],
        tagIds?: string[],
        limit?: number,
        offset?: number
    } = c.req.query();

    const games: Game[] = await getGamesByFilters({ partialTitle, categoryId, ownerIds, tagIds }, limit, offset);

    return c.json({ games: games }, 200);
}

//* Delete a game based on the slug provided in the URL
export const gameDeletionHandler = async (c: Context<Env>) => {
    const { supabase } = c.get('supabaseContext');
    const { gameSlug } = c.req.param();

    let user = null
    let organization = null
    const supabaseUser = await supabase.auth.getUser();

    // Retrive the game by slug and check if it exists
    const game = await getGameBySlug(gameSlug);
    if (!game) {
        return c.json({ message: `Game with slug ${gameSlug} not found.` }, 404);
    }

    // Check if the game was created by a user or an organization and retrieve the corresponding entity
    if (game.createdByProfileId) {
        user = await getUserById(game.createdByProfileId)

        if (!user) {
            return c.json({ message: 'The user who created this game could not be found.' }, 404);
        }

        if (supabaseUser.data.user!.id !== user.id) {
            return c.json({ message: 'You are not authorized to delete this game.' }, 403);
        }
    } else if (game.createdByOrganizationId) {
        organization = await getOrganizationById(game.createdByOrganizationId)

        if (!organization) {
            return c.json({ message: 'The organization that created this game could not be found.' }, 404);
        }

        const role = await getUserRoleInOrganization(supabaseUser.data.user!.id, organization.id);

        if (role !== 'owner') {
            return c.json({ message: 'You are not authorized to delete this game.' }, 403);
        }
    } else {
        return c.json({ message: 'The game does not have a valid creator.' }, 400);
    }

    // The user can now delete the game
    await deleteGameBySlug(gameSlug);

    return c.json({ message: `Game with slug ${gameSlug} deleted successfully!` }, 200);
}

// TODOs

//* Update a game based on the slug provided in the URL
export const gamePatchHandler = async (c: Context<Env>) => {
    const { gameSlug } = c.req.param();
    const requestBody = await c.req.json();
    return c.json({ message: `Game with slug ${gameSlug} updated successfully!`, data: requestBody }, 200);
}

export default game;