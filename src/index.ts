import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@supabase/supabase-js'
import { withSupabase } from '@supabase/server/adapters/hono'

import { loginHandler } from './routes/auth/guest'
import { registerHandler } from './routes/auth/guest'
import { refreshHandler } from './routes/auth/guest'
import { meHandler } from './routes/auth/protected'
import { logoutHandler } from './routes/auth/protected'

const origins = process.env.ORIGINS?.split(',') || []

export const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!
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

//* PROTECTED ROUTES
app.get('/auth/me', userOnly, meHandler);
app.post('/auth/logout', userOnly, logoutHandler);

export default app
