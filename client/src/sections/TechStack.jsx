import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { techStackSection } from '../data/skills'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 } }

// Per ring tone (skills.js): pill style and legend dot
const tones = {
  accent: { pill: 'border-accent/50 font-bold text-accent', dot: 'bg-accent' },
  default: { pill: 'border-border font-semibold text-ink', dot: 'bg-ink/40' },
  muted: { pill: 'border-border font-medium text-muted', dot: 'bg-ink/15' },
}

// One ring: the whole ring turns, and each pill turns back the same amount so its text stays upright.
// Sizes use cqw (the orbit's width), so the orbit scales with the screen while pills keep their font size.
// Reduced motion: both turns are switched off, leaving a still orbit.
function Ring({ ring, index, running }) {
  const { pill } = tones[ring.tone] ?? tones.default
  const spin = { animationDuration: `${ring.seconds}s`, animationPlayState: running ? 'running' : 'paused' }
  const radius = `${(ring.size / 2) * 100}cqw`
  // Start each ring at a different angle so the pills don't line up
  const offset = -90 + index * 30

  return (
    <>
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border"
        style={{ width: `${ring.size * 100}%`, height: `${ring.size * 100}%` }}
      />
      <ul aria-label={ring.legend} className="absolute inset-0 animate-orbit motion-reduce:animate-none" style={spin}>
        {ring.items.map((item, i) => {
          const angle = offset + (360 / ring.items.length) * i
          return (
            <li
              key={item}
              className="absolute left-1/2 top-1/2 h-0 w-0"
              style={{ transform: `rotate(${angle}deg) translateX(${radius}) rotate(${-angle}deg)` }}
            >
              <span
                className="absolute left-0 top-0 h-0 w-0 animate-orbit motion-reduce:animate-none"
                style={{ ...spin, animationDirection: 'reverse' }}
              >
                <span
                  className={`absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border bg-paper px-2.5 py-1 text-[11px] shadow-sm max-[359px]:px-2 max-[359px]:text-[10px] sm:px-3 sm:text-[12px] ${pill}`}
                >
                  {item}
                </span>
              </span>
            </li>
          )
        })}
      </ul>
    </>
  )
}

function Orbit({ core, rings }) {
  const ref = useRef(null)
  // Rings only turn while the orbit is on screen
  const visible = useInView(ref)

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[520px] [container-type:inline-size]">
      {rings.map((ring, i) => (
        <Ring key={ring.id} ring={ring} index={i} running={visible} />
      ))}

      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: 'clamp(60px, 17cqw, 88px)', height: 'clamp(60px, 17cqw, 88px)' }}
      >
        <span aria-hidden="true" className="absolute inset-0 animate-core-pulse rounded-full bg-accent motion-reduce:hidden" />
        <span className="relative flex h-full w-full flex-col items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_24px_-8px_rgba(255,49,49,0.6)]">
          <span className="text-[17px] font-bold leading-none sm:text-[20px]">{core.label}</span>
          <span className="mt-1 text-[8px] font-bold uppercase leading-none tracking-[1.5px] text-white/80">{core.note}</span>
        </span>
      </div>
    </div>
  )
}

export default function TechStack() {
  const { eyebrow, title, intro, core, rings } = techStackSection

  return (
    <section id="stack" className="relative overflow-hidden py-14 md:py-20">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-4 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16">
        <motion.div variants={fadeUp} {...inView}>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-3 text-[28px] font-bold leading-tight md:text-[34px]">{title}</h2>
          <p className="mt-3 max-w-[380px] text-[14px]">{intro}</p>

          <ul className="mt-8 space-y-3">
            {rings.map((ring) => (
              <li key={ring.id} className="flex items-center gap-3 text-[13px] font-medium text-ink">
                <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${(tones[ring.tone] ?? tones.default).dot}`} />
                {ring.legend}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={fadeUp} {...inView}>
          <Orbit core={core} rings={rings} />
        </motion.div>
      </div>
    </section>
  )
}
