import { config } from 'dotenv'
import { resolve } from 'node:path'

config({ path: resolve(process.cwd(), '.env') })

import { serve } from '@hono/node-server'
const { default: app } = await import('./index')

const port = Number(process.env.PORT ?? 3031)

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API listening on http://localhost:${info.port}`)
})