import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { generateReply } from '../services/chat.js'
import { HttpError } from '../lib/http.js'
import { PROJECT_PAGES } from '../services/chatPrompt.js'

const MAX_MESSAGES = 10
const MAX_LENGTH = 1000

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many messages. Please wait a minute and try again.' },
})

function parseMessages(body) {
  const { messages } = body ?? {}
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new HttpError(400, '"messages" must be a non-empty array.')
  }

  for (const m of messages) {
    if (!m || !['user', 'assistant'].includes(m.role)) {
      throw new HttpError(400, 'Each message needs a role of "user" or "assistant".')
    }
    if (typeof m.content !== 'string' || !m.content.trim()) {
      throw new HttpError(400, 'Each message needs non-empty "content".')
    }
    if (m.content.length > MAX_LENGTH) {
      throw new HttpError(400, `Messages must be ${MAX_LENGTH} characters or fewer.`)
    }
  }

  const recent = messages.slice(-MAX_MESSAGES).map(({ role, content }) => ({ role, content: content.trim() }))
  // Gemini expects the conversation to open with a user turn
  while (recent.length && recent[0].role !== 'user') recent.shift()

  if (recent.at(-1)?.role !== 'user') {
    throw new HttpError(400, 'The last message must be from the user.')
  }
  return recent
}

// Optional project page slug; unknown values are ignored rather than rejected
function parseProjectSlug(body) {
  const slug = body?.projectSlug
  return typeof slug === 'string' && PROJECT_PAGES.has(slug) ? slug : undefined
}

export const chatRouter = Router()

chatRouter.post('/', limiter, async (req, res) => {
  const messages = parseMessages(req.body)
  // { reply, projects: ["P01", …] }
  res.json(await generateReply(messages, { projectSlug: parseProjectSlug(req.body) }))
})
