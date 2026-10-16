import { existsSync, readFileSync } from 'node:fs'

// Shared by every chat provider (Gemini, Groq) so they answer from the same facts, in the same shape.
const knowledge = readFileSync(new URL('../../knowledge/nouman.md', import.meta.url), 'utf8')
// Project page details, generated from client/src/data by scripts/build-knowledge.js (npm run knowledge)
const projectsFile = new URL('../../knowledge/projects.md', import.meta.url)
const projectKnowledge = existsSync(projectsFile) ? readFileSync(projectsFile, 'utf8') : ''

// Project pages the chat can be scoped to: slug → title ("### TeamMatch AI · P01 · page /projects/teammatch-ai")
export const PROJECT_PAGES = new Map(
  [...projectKnowledge.matchAll(/^### (.+) · P\d{2} · page \/projects\/([a-z0-9-]+)$/gm)].map(([, title, slug]) => [slug, title]),
)

// Project ids straight from the knowledge file ("### P01 — TeamMatch AI")
export const PROJECT_IDS = [...knowledge.matchAll(/^### (P\d{2}) — /gm)].map(([, id]) => id)
export const MAX_PROJECTS = 2

const basePrompt = (scope) => `You are Nouman Aslam's portfolio assistant. Answer only questions about Nouman, his projects, skills, education and availability, using ONLY the knowledge below. Be short (2–4 sentences), friendly and confident. If something isn't in the knowledge, say you don't know and suggest emailing mrnoumannomi7@gmail.com. Never invent facts, numbers or links. Politely decline unrelated requests.

Style: write like a real person talking, in simple everyday words. Never use buzzwords such as "seamless", "streamline", "leverage", "cutting-edge", "robust", "revolutionize", "empower", "unlock", "elevate" or "innovative", and never use em dashes.

Language:
- Reply in the same language the user writes in: English, Urdu (Roman Urdu if they write in Latin letters, Urdu script if they write in Urdu script) or Arabic. For any other language, reply in English.
- The facts stay exactly the same in every language. Keep project names, tech names, URLs and the email address in their original English form.

Formatting rules (the chat bubble shows plain text):
- Write plain conversational sentences in one short paragraph. No headings, bullet lists, tables, code blocks or emojis.
- You may bold at most ONE project name per reply, using **double asterisks**. Never bold anything else and never use single asterisks or underscores.
- Write links as plain URLs, never as markdown links.

Output: respond with ONLY a JSON object, no text before or after it, exactly like {"reply": "...", "projects": ["P01"]}
- "reply": your answer, following the rules above.
- "projects": ids of at most ${MAX_PROJECTS} projects (${PROJECT_IDS.join(', ')}) that the reply is specifically about, most relevant first. Use an empty array when the reply is not about specific projects (greetings, availability, education, contact, unknowns).
${scope}
${knowledge}

${projectKnowledge}`

export const SYSTEM_PROMPT = basePrompt('')

// System prompt for one request; with a known projectSlug the answers focus on that project
export function systemPromptFor(projectSlug) {
  const title = projectSlug && PROJECT_PAGES.get(projectSlug)
  if (!title) return SYSTEM_PROMPT
  return basePrompt(
    `\nCurrent page: The visitor is viewing the project ${title}. Focus your answer on this project, using only the knowledge provided. If the detail isn't in the knowledge, say so and suggest emailing Nouman.\n`,
  )
}

const cleanProjects = (list) =>
  [...new Set(Array.isArray(list) ? list : [])].filter((id) => PROJECT_IDS.includes(id)).slice(0, MAX_PROJECTS)

// Turns a model's raw text into { reply, projects }. Never throws.
// JSON (optionally in a ```json fence or surrounded by text) → its fields; anything else → the plain
// text as the reply with no projects. Returns null if there is no usable reply at all.
export function parseChatReply(raw) {
  const text = String(raw ?? '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()
  if (!text) return null

  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end > start) {
    try {
      const data = JSON.parse(text.slice(start, end + 1))
      const reply = typeof data.reply === 'string' ? data.reply.trim() : ''
      if (reply) return { reply, projects: cleanProjects(data.projects), parsed: true }
    } catch {
      // fall through
    }
  }

  // Broken or truncated JSON: rescue the "reply" string, so raw JSON never reaches the visitor
  if (/"reply"\s*:/.test(text)) {
    const match = text.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)"/)
    try {
      const reply = match ? JSON.parse(`"${match[1]}"`).trim() : ''
      if (reply) return { reply, projects: [], parsed: false }
    } catch {
      // fall through
    }
    return null
  }
  if (text.startsWith('{')) return null // JSON without a readable reply

  return { reply: text, projects: [], parsed: false }
}
