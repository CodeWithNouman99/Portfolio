import Groq from 'groq-sdk'
import { config } from '../config.js'
import { shortPromptFor } from './chatPrompt.js'

const TIMEOUT_MS = 7000
// The per-minute token limit counts prompt + history + MAX_TOKENS, so all three are kept small
const MAX_TOKENS = 800
const HISTORY_MESSAGES = 5
const HISTORY_CHARS = 400

// The last question in full, earlier turns shortened
const trimHistory = (messages) =>
  messages.slice(-HISTORY_MESSAGES).map(({ role, content }, i, recent) => ({
    role,
    content: i === recent.length - 1 ? content : content.slice(0, HISTORY_CHARS),
  }))

// No SDK retries: services/chat.js decides what happens after a failure
const client = config.groq.apiKey ? new Groq({ apiKey: config.groq.apiKey, maxRetries: 0, timeout: TIMEOUT_MS }) : null

export const groqConfigured = Boolean(client)

// Groq's JSON object mode only works on models with Structured Outputs support (GPT-OSS, Qwen);
// for others the JSON shape is requested in the system prompt alone. parseChatReply() copes either way.
let useJsonMode = /^(openai\/gpt-oss|qwen\/)/.test(config.groq.model)

// messages: [{ role: 'user' | 'assistant', content }] (validated, ends with a user turn)
// → { text, model }. Throws on failure (Groq errors carry .status, never the key).
export async function askGroq(messages, systemPrompt = shortPromptFor()) {
  const request = (jsonMode) =>
    client.chat.completions.create({
      model: config.groq.model,
      temperature: 0.4,
      // Room for GPT-OSS's (hidden) reasoning, kept low, plus a short reply
      max_tokens: MAX_TOKENS,
      ...(config.groq.model.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low' } : {}),
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      messages: [{ role: 'system', content: systemPrompt }, ...trimHistory(messages)],
    })

  try {
    let completion
    try {
      completion = await request(useJsonMode)
    } catch (err) {
      // JSON mode rejected for this model: drop it for good and retry once in plain mode
      if (!useJsonMode || err.status !== 400) throw err
      console.warn(`[groq] JSON mode rejected for ${config.groq.model}, using plain mode from now on`)
      useJsonMode = false
      completion = await request(false)
    }
    const text = completion.choices?.[0]?.message?.content?.trim()
    if (!text) throw new Error('Empty reply')
    return { text, model: config.groq.model }
  } catch (err) {
    console.error(`[groq] ${config.groq.model}: ${err.status ?? ''} ${err.message}`.replace(/\s+/g, ' ').trim().slice(0, 300))
    throw err
  }
}
