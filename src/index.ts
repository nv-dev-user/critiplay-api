import { Hono } from 'hono'
import { cors } from 'hono/cors'
import user from './user'
import auth from './auth'
import { createClient } from '@supabase/supabase-js'

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

export default app
