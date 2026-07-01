import { withSupabase } from "@supabase/server/adapters/hono";
import { Hono } from "hono";

import { getGameBySlug, getGamesByFilters } from "@/db/repositories/games.repository";
import { Game } from "@/db/models/game";

const game = new Hono().basePath('/game');

game.use('*', withSupabase({ auth: 'none' }));

// Envoie toutes les informations d'un jeu (page)
game.get('/:gameSlug', async (c) => {
    const { gameSlug } = c.req.param();
    const game = await getGameBySlug(gameSlug);
    return c.json({ game: game }, game ? 200 : 404);
})

// Envoie la liste des jeux filtrés (liste, accueil, recherche)
game.get('/', async (c) => {
    const {
        partialTitle,
        categoryId,
        ownerIds,
        tagIds,
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

    let games: Game[] = await getGamesByFilters({ partialTitle, categoryId, ownerIds, tagIds }, limit, offset);

    return c.json({ games: games }, 200);
})

export default game;