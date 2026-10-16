import mongoose from 'mongoose'
import { config } from '../config.js'
import { Lead } from '../models/Lead.js'
import { forwardLead } from './n8n.js'

const INTERVAL_MS = 5 * 60 * 1000
const MAX_AGE_MS = 24 * 60 * 60 * 1000
// Leave fresh leads alone: their own request may still be waiting on n8n
const MIN_AGE_MS = 60 * 1000
const BATCH = 10

// Re-sends saved leads that never reached n8n, so a "queued" lead really does get delivered.
async function retryPendingLeads() {
  if (mongoose.connection.readyState !== 1) return
  try {
    const now = Date.now()
    const pending = await Lead.find({
      forwarded: false,
      createdAt: { $gte: new Date(now - MAX_AGE_MS), $lte: new Date(now - MIN_AGE_MS) },
    })
      .sort({ createdAt: 1 })
      .limit(BATCH)
      .lean()

    for (const { _id, name, email, company, message, createdAt } of pending) {
      const { forwarded } = await forwardLead({ name, email, company, message, createdAt })
      if (!forwarded) break // n8n still down, try the rest next round
      await Lead.updateOne({ _id }, { forwarded: true })
      console.log('[retry] Queued lead forwarded to n8n')
    }
  } catch (err) {
    console.error(`[retry] ${err.message}`)
  }
}

export function startLeadRetry() {
  if (!config.mongoUri || !config.n8nWebhookUrl) return
  setInterval(retryPendingLeads, INTERVAL_MS).unref()
}
