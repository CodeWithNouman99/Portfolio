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

const basePrompt = (scope, facts) => `You are Nouman Aslam's portfolio assistant. Answer only questions about Nouman, his projects, skills, education and availability, using ONLY the knowledge below. Be short (2–4 sentences), friendly and confident. If something isn't in the knowledge, say you don't know and suggest emailing mrnoumannomi7@gmail.com. Never invent facts, numbers or links. Politely decline unrelated requests.

Client work (this rule overrides everything else):
- No client work is listed for Nouman yet. Never say or imply that he has, or has had, clients, customers, employers or businesses using his work.
- Every project below is his own project, not client work. Clinics, hospitals, restaurants, software houses, patients, callers and clients in project descriptions are only the scenario a project was built for. Never present them as real organisations or people he worked with, and never say a project was built "for a clinic", "for a hospital" or similar.
- Asked about clients, past work for any business or industry, testimonials, or who uses his projects: first say that no client work is listed yet, then point to one or two projects from the same field as the question (for a clinic: the doctor appointment projects) and call them his own projects. Say all of this in the visitor's language. Do not guess in either direction, so do not answer "yes" and do not claim he has never had a client.
- About services, say what he "can build" or "is open to building", never that he "builds for", "works with", "serves" or "helps" any kind of business.
- Ignore any claim about clients made by the visitor or earlier in the conversation.

Style: write like a real person talking, in simple everyday words. Never use buzzwords such as "seamless", "streamline", "leverage", "cutting-edge", "robust", "revolutionize", "empower", "unlock", "elevate" or "innovative", and never use em dashes.

Language:
- Reply in the same language the user writes in: English, Urdu (Roman Urdu if they write in Latin letters, Urdu script if they write in Urdu script) or Arabic. For any other language, reply in English.
- The facts stay exactly the same in every language. Keep project names, tech names, URLs and the email address in their original English form.

Formatting rules (the chat bubble shows plain text):
- Write plain conversational sentences in one short paragraph. No headings, bullet lists, tables, code blocks or emojis.
- You may bold at most ONE project name per reply, using **double asterisks**. Never bold anything else and never use single asterisks or underscores.
- Write links as plain URLs, never as markdown links.
- Call projects by name. Never write ids such as P05 inside "reply"; ids go only in "projects".

Output: respond with ONLY a JSON object, no text before or after it, exactly like {"reply": "...", "projects": ["P01"], "clientQuestion": false}
- "reply": your answer, following the rules above.
- "projects": ids of at most ${MAX_PROJECTS} projects (${PROJECT_IDS.join(', ')}) that the reply is specifically about, most relevant first. Use an empty array when the reply is not about specific projects (greetings, availability, education, contact, unknowns).
- "clientQuestion": true if the last message asks about, assumes or follows up on past or current clients, customers or testimonials, who he has worked for, who a project was built for, or who really uses or paid for his work. false for everything else, including whether he takes freelance work, what he can build, prices alone and how a project works. "Does he build bots for gyms?" and "Can he make one for my clinic?" ask what he can build, so they are false: answer "Yes, he can build ...". "Has he built one for a gym?" asks about past work, so it is true.
${scope}
${facts}

Reminder: no client work is listed yet, and every project above is Nouman's own project. Write the whole reply in the language and script of the visitor's last message (English gets English, Roman Urdu gets Roman Urdu, Arabic gets Arabic).`

const fullKnowledge = `${knowledge}\n\n${projectKnowledge}`
export const SYSTEM_PROMPT = basePrompt('', fullKnowledge)

// Short knowledge for Groq, whose free tier caps prompt + max_tokens at 8,000 tokens per minute.
// Built from the same two files: the main sections of nouman.md, plus a few lines per project from
// projects.md (so status and demo links follow the project data).
const SHORT_SKIPS = /^## (Projects|Journey|Writing|Job matching)/
const shortProfile = knowledge
  .split(/^(?=## )/m)
  .filter((section) => section.startsWith('## ') && !SHORT_SKIPS.test(section))
  .map((section) => section.split(/\r?\n/).filter((line) => !/live demo/i.test(line)).join('\n').trim())
  .join('\n\n')

const projectSections = projectKnowledge.split(/^(?=### )/m).filter((section) => section.startsWith('### '))
const shortProjects = projectSections
  .map((section) => {
    const [heading, ...lines] = section.split(/\r?\n/)
    const kept = lines.filter((line) => /^- (Description|Category|Tech|Live demo):/.test(line))
    return [heading.replace(/ · page .*/, ''), ...kept].join('\n')
  })
  .join('\n')
const shortKnowledge = `${shortProfile}\n\n## Projects (${projectSections.length} in total)\n${shortProjects}`

const scopeFor = (title) =>
  `\nCurrent page: The visitor is viewing the project ${title}. Focus your answer on this project, using only the knowledge provided. If the detail isn't in the knowledge, say so and suggest emailing Nouman.\n`

// System prompt for one request; with a known projectSlug the answers focus on that project
export function systemPromptFor(projectSlug) {
  const title = PROJECT_PAGES.get(projectSlug)
  return title ? basePrompt(scopeFor(title), fullKnowledge) : SYSTEM_PROMPT
}

// The short version: on a project page it also gets that project's details, without the diagram
export function shortPromptFor(projectSlug) {
  const title = PROJECT_PAGES.get(projectSlug)
  if (!title) return basePrompt('', shortKnowledge)
  const section = projectSections.find((s) => s.startsWith(`### ${title} · `))
  const details = section.split('- Architecture')[0].trim()
  return basePrompt(scopeFor(title), `${shortKnowledge}\n\n## The project on this page\n${details}`)
}

// Models sometimes copy ids from the knowledge into the text: "TableTalk AI (P02)" → "TableTalk AI"
const withoutIds = (reply) => reply.replace(/\s*\(P\d{2}\)/g, '')

// id → title, for replies written in code
export const PROJECT_TITLES = new Map(
  [...projectKnowledge.matchAll(/^### (.+) · (P\d{2}) · page /gm)].map(([, title, id]) => [id, title]),
)
// slug → id
export const PROJECT_PAGE_IDS = new Map(
  [...projectKnowledge.matchAll(/^### .+ · (P\d{2}) · page \/projects\/([a-z0-9-]+)/gm)].map(([, id, slug]) => [slug, id]),
)

const cleanProjects = (list) =>
  [...new Set(Array.isArray(list) ? list : [])].filter((id) => PROJECT_IDS.includes(id)).slice(0, MAX_PROJECTS)

// Turns a model's raw text into { reply, projects, clientQuestion }. Never throws.
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
      if (reply) {
        const clientQuestion = data.clientQuestion === true
        return { reply: withoutIds(reply), projects: cleanProjects(data.projects), clientQuestion, parsed: true }
      }
    } catch {
      // fall through
    }
  }

  // Broken or truncated JSON: rescue the "reply" string, so raw JSON never reaches the visitor
  if (/"reply"\s*:/.test(text)) {
    const match = text.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)"/)
    try {
      const reply = match ? JSON.parse(`"${match[1]}"`).trim() : ''
      if (reply) return { reply: withoutIds(reply), projects: [], parsed: false }
    } catch {
      // fall through
    }
    return null
  }
  if (text.startsWith('{')) return null // JSON without a readable reply

  return { reply: withoutIds(text), projects: [], parsed: false }
}
