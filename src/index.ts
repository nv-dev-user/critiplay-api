import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createClient } from '@supabase/supabase-js'

import game from './routes/game'
import auth from './routes/auth'
import user from './routes/user'

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

app.route('/', user);
app.route('/', auth);
app.route('/', game)

export default app
