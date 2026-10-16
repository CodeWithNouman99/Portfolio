// Vercel serverless entry. Locally and on a long-running host, src/index.js is used instead.
// Not available here: the background retry of leads that n8n missed (src/services/leadRetry.js),
// because serverless functions don't keep timers running between requests.
import { app } from '../src/app.js'
import { connectDb } from '../src/db.js'

export default async function handler(req, res) {
  await connectDb()
  return app(req, res)
}
