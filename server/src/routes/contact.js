import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { config } from '../config.js'
import { HttpError } from '../lib/http.js'
import { Lead } from '../models/Lead.js'
import { forwardLead } from '../services/n8n.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const LIMITS = { name: 100, email: 254, company: 100, message: 5000 }

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many messages sent. Please try again in a few minutes.' },
})

function parseLead(body) {
  const read = (key) => (typeof body?.[key] === 'string' ? body[key].trim() : '')
  const lead = {
    name: read('name'),
    email: read('email').toLowerCase(),
    company: read('company'),
    message: read('message'),
  }

  if (!lead.name) throw new HttpError(400, 'Name is required.')
  if (!lead.email) throw new HttpError(400, 'Email is required.')
  if (!EMAIL_RE.test(lead.email)) throw new HttpError(400, 'Email is not valid.')
  if (!lead.message) throw new HttpError(400, 'Message is required.')
  for (const [key, max] of Object.entries(LIMITS)) {
    if (lead[key].length > max) throw new HttpError(400, `${key[0].toUpperCase()}${key.slice(1)} must be ${max} characters or fewer.`)
  }
  return lead
}

export const contactRouter = Router()

// Response for the client's live tracker. Only these fields ever leave the server:
// { ok, steps: { received, saved, forwarded, ai: { type } | null, notified }, queued, automation, timings }
// automation is false when no n8n webhook is configured, so the client shows only the steps that can happen
// timings are per-step durations in ms: `forwarded` is only the hand-off to n8n, `ai` is the
// wait for n8n's reply (AI + email run inside it), and `notified` is null.
contactRouter.post('/', limiter, async (req, res) => {
  let start = performance.now()
  const elapsed = () => {
    const now = performance.now()
    const ms = Math.round(now - start)
    start = now
    return ms
  }

  const lead = parseLead(req.body)
  if (!config.mongoUri && !config.n8nWebhookUrl) {
    throw new HttpError(503, 'The contact form is not configured yet.')
  }
  const timings = { received: elapsed(), saved: null, forwarded: null, ai: null, notified: null }

  let doc = null
  if (config.mongoUri) {
    try {
      doc = await Lead.create(lead)
      lead.createdAt = doc.createdAt
    } catch (err) {
      console.error(`[contact] Lead not saved to MongoDB: ${err.message}`)
    }
    timings.saved = elapsed()
  }
  lead.createdAt ??= new Date()

  // Never throws; waits up to 25s for n8n's { type, notified } reply
  const { forwarded, ai, notified, timings: n8n } = await forwardLead(lead)
  if (forwarded) {
    timings.forwarded = n8n.handoff
    timings.ai = n8n.processing
  }

  // n8n being down never fails the request, but a lead that reached nowhere must not look delivered
  if (!doc && !forwarded) throw new HttpError(502, 'Your message could not be delivered.')

  if (doc && forwarded) {
    Lead.updateOne({ _id: doc._id }, { forwarded: true }).catch((err) =>
      console.error(`[contact] Could not mark lead as forwarded: ${err.message}`),
    )
  }

  console.log(`[contact] Lead received (mongo: ${Boolean(doc)}, n8n: ${forwarded}, type: ${ai?.type ?? '-'}, notified: ${notified})`)
  res.status(201).json({
    ok: true,
    steps: { received: true, saved: Boolean(doc), forwarded, ai, notified },
    queued: !notified,
    automation: Boolean(config.n8nWebhookUrl),
    timings,
  })
})
