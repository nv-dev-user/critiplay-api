import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono'
]

app.use('/*', cors({
  origin: ['https://critiplay.com', 'https://www.critiplay.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})

export default app
