import { withSupabase } from '@supabase/server/adapters/hono'
import { createClient } from '@supabase/supabase-js'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { loginHandler, registerHandler , refreshHandler  } from './routes/auth/guest'
import { meHandler, logoutHandler  } from './routes/auth/protected'
import { gameHandler } from './routes/game'

const origins = process.env.ORIGINS?.split(',') ?? []

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY must be set in environment variables')
}

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY
);

const app = new Hono()

app.use('/*', cors({
  origin: origins,
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}))

const guest = withSupabase({ auth: 'none' })
const userOnly = withSupabase({ auth: 'user' })

//* PUBLIC ROUTES
app.post('/auth/login', guest, loginHandler);
app.post('/auth/register', guest, registerHandler);
app.post('/auth/refresh', guest, refreshHandler);
app.get('/game/:gameSlug', guest, gameHandler);

//* PROTECTED ROUTES
app.get('/auth/me', userOnly, meHandler);
app.post('/auth/logout', userOnly, logoutHandler);

export default app
