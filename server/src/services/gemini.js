import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { config } from '../config.js'
import { PROJECT_IDS, SYSTEM_PROMPT } from './chatPrompt.js'

const CHAT_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    reply: { type: SchemaType.STRING },
    projects: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING, format: 'enum', enum: PROJECT_IDS },
    },
  },
  required: ['reply', 'projects'],
}

const client = config.gemini.apiKey ? new GoogleGenerativeAI(config.gemini.apiKey) : null

export const geminiConfigured = Boolean(client)

// Overload / rate-limit / transient server errors are worth one more try on the fallback model
const RETRYABLE = new Set([429, 500, 503, 504])
const attempts = [...new Set([config.gemini.model, config.gemini.fallbackModel])]

// messages: [{ role: 'user' | 'assistant', content }] (validated, ends with a user turn)
// → { text, model }. Tries the main model, then the Gemini fallback model once for retryable
// errors or timeouts; throws the last error (with .status when Google sent one) if both fail.
export async function askGemini(messages, systemPrompt = SYSTEM_PROMPT) {
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  let lastError
  for (const [i, name] of attempts.entries()) {
    try {
      const model = client.getGenerativeModel(
        {
          model: name,
          systemInstruction: systemPrompt,
          generationConfig: { temperature: 0.4, responseMimeType: 'application/json', responseSchema: CHAT_SCHEMA },
        },
        { timeout: 20000 },
      )
      const text = (await model.generateContent({ contents })).response.text()?.trim()
      if (!text) throw new Error('Empty reply')
      return { text, model: name }
    } catch (err) {
      // SDK errors carry the HTTP status, never the key
      console.error(`[gemini] ${name}: ${err.status ?? ''} ${err.message}`.replace(/\s+/g, ' ').trim().slice(0, 300))
      lastError = err
      const timedOut = /aborted/i.test(err.message)
      if (i === attempts.length - 1 || !(RETRYABLE.has(err.status) || timedOut)) break
    }
  }
  throw lastError
}
