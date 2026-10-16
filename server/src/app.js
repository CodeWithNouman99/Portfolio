import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from './config.js'
import { chatRouter } from './routes/chat.js'
import { contactRouter } from './routes/contact.js'

// The Express app on its own, shared by the long-running server (src/index.js)
// and the Vercel serverless entry (api/index.js)
export const app = express()

app.set('trust proxy', config.trustProxy)
app.disable('x-powered-by')
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
// Also answers OPTIONS preflights (204) for every route
app.use(
  cors({
    origin(origin, callback) {
      // No Origin header: same-origin, curl, server-to-server
      if (!origin || config.allowedOrigins.includes(origin)) return callback(null, true)
      console.warn(`[cors] Blocked origin ${origin} (allowed: ${config.allowedOrigins.join(', ')})`)
      callback(null, false)
    },
    methods: ['GET', 'POST'],
  }),
)
app.use(express.json({ limit: '20kb' }))

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/chat', chatRouter)
app.use('/api/contact', contactRouter)

app.use((req, res) => res.status(404).json({ error: 'Not found.' }))

// Express 5 forwards async errors here
app.use((err, req, res, _next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body.' })
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request body is too large.' })
  if (err.status) return res.status(err.status).json({ error: err.message })

  console.error('[server]', err)
  res.status(500).json({ error: 'Something went wrong on the server.' })
})
