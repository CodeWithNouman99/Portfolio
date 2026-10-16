// Thin client for the Express API in /server. Every helper throws on network or HTTP errors,
// so callers only need one try/catch.
const API_URL = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '')
const TIMEOUT_MS = 20000

if (import.meta.env.DEV && !API_URL) {
  console.warn('[api] VITE_API_URL is not set — requests go to this dev server. Add it to client/.env and restart Vite.')
}

const logged = new Set()

async function post(path, body) {
  const url = `${API_URL}${path}`
  if (import.meta.env.DEV && !logged.has(url)) {
    logged.add(url)
    console.info(`[api] POST ${url}`)
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
    return data
  } finally {
    clearTimeout(timer)
  }
}

// { name, email, company?, message } → whatever the server returns
export function sendContact(form) {
  return post('/api/contact', form)
}

// messages: [{ role: 'user' | 'assistant', content }], projectSlug? → { reply, projects: ['P01', …] }
export async function sendChat(messages, projectSlug) {
  const { reply, projects } = await post('/api/chat', projectSlug ? { messages, projectSlug } : { messages })
  if (typeof reply !== 'string' || !reply.trim()) throw new Error('Empty reply')
  return { reply, projects: Array.isArray(projects) ? projects : [] }
}
