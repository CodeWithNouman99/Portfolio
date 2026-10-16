import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoose from 'mongoose'
import { config, logConfig } from './config.js'
import { chatRouter } from './routes/chat.js'
import { contactRouter } from './routes/contact.js'
import { startLeadRetry } from './services/leadRetry.js'

const app = express()

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

logConfig()
startLeadRetry()

if (config.mongoUri) {
  // Fail fast instead of buffering writes for 10s when the database is unreachable
  mongoose.set('bufferCommands', false)
  mongoose
    .connect(config.mongoUri, { serverSelectionTimeoutMS: 8000 })
    .then(() => console.log('[mongo] Connected'))
    .catch((err) => console.error(`[mongo] Connection failed: ${err.message}`))
}

// Express 5 passes listen errors to this callback
app.listen(config.port, (err) => {
  if (err) {
    console.error(
      err.code === 'EADDRINUSE'
        ? `[server] Port ${config.port} is already in use: another server is still running. Stop it and restart.`
        : `[server] Failed to start: ${err.message}`,
    )
    process.exit(1)
  }
  console.log(`[server] Listening on http://localhost:${config.port}`)
})
