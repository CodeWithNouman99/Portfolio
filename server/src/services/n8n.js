import http from 'node:http'
import https from 'node:https'
import { config } from '../config.js'

const TIMEOUT_MS = 25000
const TYPES = ['Recruiter', 'Client', 'Collaboration', 'Other']

// "  recruiter " → "Recruiter"; anything not in TYPES → null
const parseType = (value) =>
  typeof value === 'string' ? (TYPES.find((t) => t.toLowerCase() === value.trim().toLowerCase()) ?? null) : null

// POSTs JSON and resolves with { status, raw, handoffMs, totalMs }.
// handoffMs: until the request body was flushed to n8n; totalMs: until n8n's reply finished.
// Uses node:http rather than fetch because fetch can't tell the hand-off apart from the wait.
function postJson(url, payload, timeoutMs) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload)
    const target = new URL(url)
    const start = performance.now()
    let handoffMs = null

    const req = (target.protocol === 'https:' ? https : http).request(
      target,
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } },
      (res) => {
        let raw = ''
        res.setEncoding('utf8')
        res.on('data', (chunk) => (raw += chunk))
        res.on('end', () => {
          clearTimeout(timer)
          resolve({ status: res.statusCode, raw, handoffMs, totalMs: Math.round(performance.now() - start) })
        })
        res.on('error', reject)
      },
    )
    const timer = setTimeout(() => req.destroy(Object.assign(new Error('timed out'), { name: 'AbortError' })), timeoutMs)
    req.on('finish', () => (handoffMs = Math.round(performance.now() - start)))
    req.on('error', (err) => {
      clearTimeout(timer)
      reject(err)
    })
    req.end(body)
  })
}

// Sends the lead to n8n and waits for its "Respond to Webhook" reply: { type, notified }.
// Returns { forwarded, ai: { type } | null, notified, timings: { handoff, processing } }.
// Never throws: n8n being down must not break the request. Anything else n8n sends back
// (priority, summary, suggested_reply…) is dropped.
export async function forwardLead(lead) {
  const none = { forwarded: false, ai: null, notified: false, timings: { handoff: null, processing: null } }
  if (!config.n8nWebhookUrl) return none

  let reply
  try {
    reply = await postJson(config.n8nWebhookUrl, { ...lead, source: 'portfolio' }, TIMEOUT_MS)
    if (reply.status < 200 || reply.status >= 300) throw new Error(`HTTP ${reply.status}`)
  } catch (err) {
    console.warn(`[n8n] Lead not forwarded: ${err.name === 'AbortError' ? 'timed out' : err.message}`)
    return none
  }

  // Development only: n8n's raw reply, to debug the workflow's "Respond to Webhook" node
  if (config.isDev) console.log(`[n8n] Raw reply (${reply.totalMs}ms): ${reply.raw.slice(0, 2000) || '<empty>'}`)

  // n8n accepted the lead; a missing or malformed reply only means we can't show its result
  let data = null
  try {
    data = JSON.parse(reply.raw)
  } catch {
    // leave data null
  }
  const type = parseType(data?.type)
  const notified = data?.notified === true
  if (!type || !notified) console.warn('[n8n] Unexpected webhook reply (expected { type, notified })')

  const handoff = reply.handoffMs ?? reply.totalMs
  return {
    forwarded: true,
    ai: type ? { type } : null,
    notified,
    timings: { handoff, processing: reply.totalMs - handoff },
  }
}
