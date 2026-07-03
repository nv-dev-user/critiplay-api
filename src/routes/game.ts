import type { Context} from "hono";
import { Hono } from "hono";

import type { Game } from "@/db/models/game";
import { getGameBySlug, getGamesByFilters } from "@/db/repositories/games.repository";

const game = new Hono().basePath('/game');

// Envoie toutes les informations d'un jeu (page)
export const gameHandler = async (c: Context) => {
    const { gameSlug } = c.req.param();
    const game = await getGameBySlug(gameSlug);
    return c.json({ game: game }, game ? 200 : 404);
}

// Envoie la liste des jeux filtrés (liste, accueil, recherche)
game.get('/', async (c) => {
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
})

// TODOs

game.patch('/:gameSlug', async (c) => {
    const { gameSlug } = c.req.param();
    const requestBody = await c.req.json();
    return c.json({ message: `Game with slug ${gameSlug} updated successfully!`, data: requestBody }, 200);
})

game.delete('/:gameSlug', (c) => {
    const { gameSlug } = c.req.param();
    return c.json({ message: `Game with slug ${gameSlug} deleted successfully!` }, 200);
})

export default game;