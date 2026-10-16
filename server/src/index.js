import { app } from './app.js'
import { config, logConfig } from './config.js'
import { connectDb } from './db.js'
import { startLeadRetry } from './services/leadRetry.js'

logConfig()
startLeadRetry()
connectDb()

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
