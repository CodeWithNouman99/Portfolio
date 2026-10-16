import 'dotenv/config'

const env = (key, fallback = '') => (process.env[key] ?? '').trim() || fallback
const isDev = env('NODE_ENV', 'development') !== 'production'

// CLIENT_URL may hold several comma-separated origins; trailing slashes never match an Origin header
const clientUrls = env('CLIENT_URL', 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean)
// Vite falls back to 5174 when 5173 is taken, so allow both locally
const DEV_ORIGINS = ['http://localhost:5173', 'http://localhost:5174']

export const config = {
  isDev,
  port: Number(env('PORT', '5000')),
  allowedOrigins: [...new Set([...clientUrls, ...(isDev ? DEV_ORIGINS : [])])],
  // Number of proxies in front of the app (1 on Render/Railway/Vercel) so rate limits see real IPs
  trustProxy: Number(env('TRUST_PROXY', '0')),
  gemini: {
    apiKey: env('GEMINI_API_KEY'),
    model: env('GEMINI_MODEL', 'gemini-3.8-flash'),
    // Used once when the main model is overloaded or rate-limited
    fallbackModel: env('GEMINI_FALLBACK_MODEL', 'gemini-3.6-flash'),
  },
  // Second chat provider, used when Gemini is rate-limited or down
  groq: {
    apiKey: env('GROQ_API_KEY'),
    // llama-3.3-70b-versatile / llama-3.1-8b-instant aren't available to every Groq account
    model: env('GROQ_MODEL', 'openai/gpt-oss-20b'),
  },
  mongoUri: env('MONGODB_URI'),
  n8nWebhookUrl: env('N8N_WEBHOOK_URL'),
}

// Startup report: which features are live. Values are never printed, only whether they're set.
export function logConfig() {
  console.log(`[config] CORS origins: ${config.allowedOrigins.join(', ')}`)
  const chatProviders = [
    config.gemini.apiKey && `Gemini (${config.gemini.model})`,
    config.groq.apiKey && `Groq (${config.groq.model})`,
  ].filter(Boolean)
  if (chatProviders.length) console.log(`[config] Chat providers, in order: ${chatProviders.join(' → ')}`)
  else console.warn('[config] GEMINI_API_KEY and GROQ_API_KEY are empty — chat will only answer the suggestion chips')
  if (!config.mongoUri) console.warn('[config] MONGODB_URI is empty — contact leads will not be saved to MongoDB')
  if (!config.n8nWebhookUrl) console.warn('[config] N8N_WEBHOOK_URL is empty — contact leads will not be forwarded to n8n')
  if (!config.mongoUri && !config.n8nWebhookUrl) {
    console.warn('[config] No lead destination configured — /api/contact will return 503')
  }
}
