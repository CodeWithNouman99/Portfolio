import Groq from 'groq-sdk'
import { config } from '../config.js'
import { SYSTEM_PROMPT } from './chatPrompt.js'

// No SDK retries: services/chat.js decides what happens after a failure
const client = config.groq.apiKey ? new Groq({ apiKey: config.groq.apiKey, maxRetries: 0, timeout: 20000 }) : null

export const groqConfigured = Boolean(client)

// Groq's JSON object mode only works on models with Structured Outputs support (GPT-OSS, Qwen);
// for others the JSON shape is requested in the system prompt alone. parseChatReply() copes either way.
let useJsonMode = /^(openai\/gpt-oss|qwen\/)/.test(config.groq.model)

// messages: [{ role: 'user' | 'assistant', content }] (validated, ends with a user turn)
// → { text, model }. Throws on failure (Groq errors carry .status, never the key).
export async function askGroq(messages, systemPrompt = SYSTEM_PROMPT) {
  const request = (jsonMode) =>
    client.chat.completions.create({
      model: config.groq.model,
      temperature: 0.4,
      // Room for GPT-OSS's (hidden) reasoning plus a short reply
      max_tokens: 1500,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      messages: [{ role: 'system', content: systemPrompt }, ...messages.map(({ role, content }) => ({ role, content }))],
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
