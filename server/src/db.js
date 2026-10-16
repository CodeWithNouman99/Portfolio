import mongoose from 'mongoose'
import { config } from './config.js'

let connecting = null

// Connects once and reuses the connection, so a warm serverless function doesn't reconnect per request
export function connectDb() {
  if (!config.mongoUri) return Promise.resolve(null)
  if (mongoose.connection.readyState === 1) return Promise.resolve(mongoose.connection)
  if (!connecting) {
    // Fail fast instead of buffering writes for 10s when the database is unreachable
    mongoose.set('bufferCommands', false)
    connecting = mongoose
      .connect(config.mongoUri, { serverSelectionTimeoutMS: 8000 })
      .then((m) => {
        console.log('[mongo] Connected')
        return m.connection
      })
      .catch((err) => {
        console.error(`[mongo] Connection failed: ${err.message}`)
        connecting = null
        return null
      })
  }
  return connecting
}
