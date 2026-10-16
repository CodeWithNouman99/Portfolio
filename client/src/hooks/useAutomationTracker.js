import { useCallback, useEffect, useRef, useState } from 'react'

// Minimum time each step stays "in progress" so the flow is readable even when the server is fast
export const STEP_MS = 600
const STEP_COUNT = 5

// state: pending | active | done | queued | skipped. ms: server-measured duration, when known
const initialSteps = () => Array.from({ length: STEP_COUNT }, () => ({ state: 'pending', ms: null }))
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Drives the contact form's Live Automation Tracker.
//   start()           while the request is in flight: steps 1 → 2 → 3 (3 keeps spinning)
//   resolve(data)     reconcile with the real /api/contact result, then play steps 3 → 5
//   resolve(data, { instant: true })  reduced motion: jump straight to the final states
//   reset()           back to all pending (also cancels a running timeline)
export default function useAutomationTracker() {
  const [steps, setSteps] = useState(initialSteps)
  const [type, setType] = useState(null)
  const [queued, setQueued] = useState(false)
  const [finished, setFinished] = useState(false)
  const runId = useRef(0)
  const phaseOne = useRef(Promise.resolve())
  const activeSince = useRef(0)

  // Unmounting cancels any timeline still running
  useEffect(() => () => void runId.current++, [])

  const setStep = (i, state, ms) =>
    setSteps((prev) => prev.map((s, j) => (j === i ? { state, ms: ms ?? s.ms } : s)))

  const activate = (i) => {
    setStep(i, 'active')
    activeSince.current = performance.now()
  }

  // Wait out whatever is left of the current step's minimum on-screen time
  const holdActive = () => sleep(Math.max(0, STEP_MS - (performance.now() - activeSince.current)))

  const reset = useCallback(() => {
    runId.current++
    phaseOne.current = Promise.resolve()
    setSteps(initialSteps())
    setType(null)
    setQueued(false)
    setFinished(false)
  }, [])

  const start = useCallback(() => {
    const id = ++runId.current
    phaseOne.current = (async () => {
      activate(0)
      await holdActive()
      if (runId.current !== id) return
      setStep(0, 'done')
      activate(1)
      await holdActive()
      if (runId.current !== id) return
      setStep(1, 'done')
      activate(2)
    })()
  }, [])

  const resolve = useCallback(async (data, { instant = false } = {}) => {
    const id = runId.current
    const alive = () => runId.current === id
    const s = data?.steps ?? {}
    const t = data?.timings ?? {}
    const typeLabel = s.ai?.type ?? null
    const finalFor = {
      forwarded: s.forwarded ? 'done' : 'queued',
      // A notified lead was clearly read by the AI, even if n8n sent no usable type (no chip then)
      ai: typeLabel || s.notified ? 'done' : 'queued',
      notified: s.notified ? 'done' : 'queued',
    }

    if (instant) {
      setSteps([
        { state: 'done', ms: t.received ?? null },
        { state: s.saved ? 'done' : 'skipped', ms: t.saved ?? null },
        { state: finalFor.forwarded, ms: t.forwarded ?? null },
        { state: finalFor.ai, ms: t.ai ?? null },
        { state: finalFor.notified, ms: t.notified ?? null },
      ])
      setType(typeLabel)
      setQueued(Boolean(data?.queued))
      setFinished(true)
      return
    }

    await phaseOne.current
    if (!alive()) return

    // Steps 1–2 were shown optimistically; settle them with the real result and timings
    setStep(0, 'done', t.received)
    setStep(1, s.saved ? 'done' : 'skipped', t.saved)

    await holdActive()
    if (!alive()) return
    setStep(2, finalFor.forwarded, t.forwarded)

    if (s.forwarded) {
      activate(3)
      await holdActive()
      if (!alive()) return
      setType(typeLabel)
      setStep(3, finalFor.ai, t.ai)

      activate(4)
      await holdActive()
      if (!alive()) return
      setStep(4, finalFor.notified, t.notified)
    } else {
      // n8n never got it: nothing more can happen until the server's retry delivers it
      setStep(3, 'queued')
      setStep(4, 'queued')
    }

    setQueued(Boolean(data?.queued))
    setFinished(true)
  }, [])

  return { steps, type, queued, finished, start, resolve, reset }
}
