import { config } from '../config.js'
import { PROJECT_PAGE_IDS, PROJECT_TITLES, parseChatReply, shortPromptFor, systemPromptFor } from './chatPrompt.js'
import { clientWorkAnswer, isCapabilityQuestion, isClientQuestion } from './clientWork.js'
import { askGemini, geminiConfigured } from './gemini.js'
import { askGroq, groqConfigured } from './groq.js'
import { quickAnswer } from './quickAnswers.js'

// Shown when every provider fails: a normal reply, never an error state in the widget
export const FALLBACK_REPLY =
  "I'm getting a lot of questions right now. Email Nouman at mrnoumannomi7@gmail.com and he'll reply personally."

// After a 429 a provider is skipped for a while, so visitors don't wait on a request that will fail.
// Groq says how long in "retry-after" (usually seconds, as its limit is per minute).
const COOLDOWN_MS = 10 * 60 * 1000
const cooldownFor = (err) => Number(err.headers?.get?.('retry-after')) * 1000 || COOLDOWN_MS

// Tried in this order; on any failure (429, 5xx, timeout, bad reply) the next one is used
const providers = [
  { name: 'gemini', configured: geminiConfigured, ask: askGemini, promptFor: systemPromptFor, cooldownUntil: 0 },
  { name: 'groq', configured: groqConfigured, ask: askGroq, promptFor: shortPromptFor, cooldownUntil: 0 },
]

// Development only: which provider answered each request
const devLog = (message) => config.isDev && console.log(`[chat] ${message}`)

// messages: validated history ending with a user turn → { reply, projects }. Never throws.
// projectSlug (optional): the project page the visitor asked from; answers focus on that project.
export async function generateReply(messages, { projectSlug } = {}) {
  // Quick answers are general, so a project-scoped question always goes to the model
  const quick = projectSlug ? null : quickAnswer(messages)
  if (quick) {
    devLog('answered by local quick answer (no AI call)')
    return quick
  }

  const question = messages.at(-1).content
  const clientAnswer = () => clientWorkAnswer(question, PROJECT_TITLES, PROJECT_PAGE_IDS.get(projectSlug))
  if (isClientQuestion(question)) {
    devLog('client question, answered by clientWork.js (no AI call)')
    return clientAnswer()
  }

  for (const provider of providers) {
    if (!provider.configured) continue
    if (provider.cooldownUntil > Date.now()) {
      devLog(`${provider.name} skipped (rate-limited, cooling down)`)
      continue
    }

    const start = performance.now()
    try {
      const { text, model } = await provider.ask(messages, provider.promptFor(projectSlug))
      const result = parseChatReply(text)
      if (!result) throw new Error('No usable reply in the response')
      devLog(
        `answered by ${provider.name} (${model}) in ${Math.round(performance.now() - start)}ms${
          result.parsed ? '' : ', plain text (no JSON)'
        }`,
      )
      if (!result.clientQuestion) return { reply: result.reply, projects: result.projects }
      if (!isCapabilityQuestion(question)) return clientAnswer()
      // A skills or "can he build" question the model mistook for a client question: keep its answer,
      // minus the client-work opener it tends to add ("No client work is listed yet. He knows …")
      const reply = result.reply.replace(/^No client work is listed( for Nouman)? yet(\.\s*|,\s*but\s+)/i, '')
      return { reply: reply.charAt(0).toUpperCase() + reply.slice(1), projects: result.projects }
    } catch (err) {
      if (err.status === 429) provider.cooldownUntil = Date.now() + cooldownFor(err)
      devLog(`${provider.name} failed (${err.status ?? err.message}), trying the next provider`)
    }
  }

  devLog('every provider failed, sent the fallback reply')
  return { reply: FALLBACK_REPLY, projects: [] }
}
