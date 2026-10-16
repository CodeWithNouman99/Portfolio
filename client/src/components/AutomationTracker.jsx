import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Clock3, Minus, RotateCcw } from 'lucide-react'
import { contact } from '../data/contact'

const { tracker } = contact

// "0.4s", or "35ms" for the very fast steps
const formatMs = (ms) => (ms < 100 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`)

function StepIcon({ state }) {
  const base = 'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-paper'
  switch (state) {
    case 'active':
      return (
        <span className={base}>
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
        </span>
      )
    case 'done':
      return (
        <span className={`${base} !bg-dark text-white`}>
          <Check size={14} strokeWidth={3} />
        </span>
      )
    case 'queued':
      return (
        <span className={`${base} !bg-surface text-grey`}>
          <Clock3 size={14} />
        </span>
      )
    case 'skipped':
      return (
        <span className={`${base} !bg-surface text-muted`}>
          <Minus size={14} />
        </span>
      )
    default:
      return <span className={`${base} border-2 border-border`} />
  }
}

function Step({ index, step, type, last, reduced }) {
  const { state, ms } = step
  const settled = state === 'done' || state === 'queued' || state === 'skipped'
  const isAi = index === 3

  return (
    <li className="relative flex gap-4 pb-5 last:pb-0">
      {/* Connector to the next step; turns black once this step is done */}
      {!last && (
        <span
          aria-hidden="true"
          className={`absolute left-[11px] top-6 h-[calc(100%-24px)] w-0.5 transition-colors duration-500 ${
            state === 'done' ? 'bg-dark' : 'bg-border'
          }`}
        />
      )}
      <StepIcon state={state} />

      <div className="flex min-w-0 flex-1 items-start justify-between gap-3 pt-0.5">
        <div className="min-w-0">
          <p
            className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] leading-snug transition-colors md:text-[15px] ${
              state === 'pending' ? 'text-muted' : 'font-medium text-ink'
            }`}
          >
            <span>{tracker.steps[index]}</span>
            {isAi && type && state === 'done' && (
              <motion.span
                initial={reduced ? false : { opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 text-muted"
              >
                <ArrowRight size={13} aria-hidden="true" />
                <span className="rounded-full bg-dark px-2.5 py-0.5 text-[11px] font-bold text-white">
                  {type} {tracker.enquiry}
                </span>
              </motion.span>
            )}
            {state === 'skipped' && <span className="text-[12px] text-muted">· {tracker.skipped}</span>}
          </p>
          {state === 'queued' && index === 4 && (
            <p className="mt-1 text-[12px] leading-snug text-muted">{tracker.queued}</p>
          )}
        </div>
        {settled && ms != null && (
          <span className="shrink-0 pt-0.5 text-[12px] tabular-nums text-muted">{formatMs(ms)}</span>
        )}
      </div>
    </li>
  )
}

export default function AutomationTracker({ steps, type, finished, firstName, onReset, onHowBuilt, reduced }) {
  // Screen readers get one summary line per settled step instead of every spinner change
  const announced = steps
    .map((s, i) => (s.state === 'pending' || s.state === 'active' ? null : `${tracker.steps[i]}: ${s.state}`))
    .filter(Boolean)
    .join('. ')

  return (
    <div className="text-left">
      <p className="eyebrow">{tracker.eyebrow}</p>
      <h3 className="mt-3 text-[20px] font-bold leading-snug md:text-[24px]">{tracker.title}</h3>

      <ol className="mt-6">
        {steps.map((step, i) => (
          <Step key={i} index={i} step={step} type={type} last={i === steps.length - 1} reduced={reduced} />
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        {announced}
      </p>

      <AnimatePresence>
        {finished && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-6 border-t border-border pt-5"
          >
            <p className="text-[14px] font-medium text-ink md:text-[15px]">{tracker.thanks(firstName)}</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-[13px] font-bold">
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 text-ink underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                <RotateCcw size={13} /> {tracker.another}
              </button>
              <button
                type="button"
                onClick={onHowBuilt}
                className="inline-flex items-center gap-1.5 text-ink underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {tracker.howBuilt} <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
