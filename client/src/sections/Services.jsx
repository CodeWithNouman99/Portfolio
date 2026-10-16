import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { services } from '../data/services'
import { projects } from '../data/projects'
import { focusProject } from '../lib/focusProject'
import { openChat } from '../lib/openChat'
import ServiceIllustration from '../components/ServiceIllustrations'

const { items } = services
const ADVANCE_S = 6 // seconds per service while auto-playing
const IDLE_MS = 10000 // auto-play resumes this long after the last click

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 } }

// Slugs → project links; { action: 'chat' } → opens the floating chat
function resolveLinks(links) {
  return links
    .map((link) => {
      if (typeof link !== 'string') return { key: link.label, label: link.label, chat: true }
      const project = projects.find((p) => p.slug === link)
      return project && { key: project.id, label: project.title, project }
    })
    .filter(Boolean)
}

// Desktop: vertical list with a red bar and a 6s progress line on the active item
function ServiceList({ active, progress, reduced, onSelect, onHover }) {
  return (
    <div role="tablist" aria-label="Services" aria-orientation="vertical" className="hidden flex-col md:flex">
      {items.map((service, i) => {
        const isActive = i === active
        return (
          <button
            key={service.id}
            id={`service-tab-${service.id}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="service-panel"
            onClick={() => onSelect(i)}
            onMouseEnter={() => onHover(i)}
            className={`group relative border-b border-border py-6 pl-6 pr-4 text-left outline-none transition-colors first:border-t focus-visible:bg-surface-soft ${
              isActive ? '' : 'hover:bg-surface-soft/60'
            }`}
          >
            <motion.span
              aria-hidden="true"
              className="absolute bottom-0 left-0 top-0 w-[2px] origin-top bg-accent"
              initial={false}
              animate={{ scaleY: isActive ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: 'easeOut' }}
            />
            <span className="flex items-baseline gap-4">
              <span className="text-[12px] font-bold tracking-[1px] text-accent">{service.id}</span>
              <span
                className={`text-[19px] font-semibold leading-snug transition-colors ${
                  isActive ? 'text-ink' : 'text-ink/45 group-hover:text-ink/70'
                }`}
              >
                {service.title}
              </span>
            </span>
            {isActive && !reduced && (
              <span aria-hidden="true" className="mt-4 block h-px w-full bg-border">
                <motion.span style={{ scaleX: progress }} className="block h-px origin-left bg-accent" />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// Mobile: horizontal row of pill tabs above the card
function ServicePills({ active, onSelect }) {
  return (
    <div
      role="tablist"
      aria-label="Services"
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:hidden"
    >
      {items.map((service, i) => {
        const isActive = i === active
        return (
          <button
            key={service.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls="service-panel"
            onClick={() => onSelect(i)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
              isActive ? 'border-dark bg-dark text-white' : 'border-border bg-paper text-ink/55'
            }`}
          >
            <span className="text-[11px] font-bold text-accent">{service.id}</span>
            {service.title}
          </button>
        )
      })}
    </div>
  )
}

function ServiceCard({ service, reduced, onProject }) {
  const links = resolveLinks(service.links)

  return (
    <div
      id="service-panel"
      role="tabpanel"
      aria-labelledby={`service-tab-${service.id}`}
      className="rounded-2xl border border-border bg-paper p-5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.18)] md:p-8"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={service.id}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }}
          exit={reduced ? { opacity: 1 } : { opacity: 0, y: -6, transition: { duration: 0.15, ease: 'easeIn' } }}
        >
          <div className="flex h-[200px] items-center justify-center rounded-xl bg-surface-soft p-3 md:h-[260px] md:p-4">
            <ServiceIllustration type={service.illustration} reduced={reduced} />
          </div>

          <h3 className="mt-6 text-[20px] font-bold leading-snug text-ink-heading md:mt-7 md:text-[22px]">
            {service.title}
          </h3>
          <p className="mt-3 text-[15px] leading-[1.7] text-ink/60 md:text-base">{service.description}</p>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech">
            {service.chips.map((chip) => (
              <li key={chip} className="rounded-full bg-surface px-3.5 py-1.5 text-[12px] font-medium text-ink">
                {chip}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5">
            <span className="text-stat-label uppercase tracking-stat text-muted">{services.seeItIn}</span>
            {links.map((link) => (
              <button
                key={link.key}
                type="button"
                onClick={() => (link.chat ? openChat() : onProject(link.project.id))}
                className="group/link inline-flex items-center gap-1 text-sm font-bold text-accent transition-colors hover:text-ink"
              >
                {link.label}
                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function Services() {
  const reduced = useReducedMotion()
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [clicked, setClicked] = useState(false)
  const idleTimer = useRef(null)
  const progress = useMotionValue(0) // 0 → 1 over ADVANCE_S for the active item
  const playback = useRef(null)

  const paused = reduced || hovering || clicked

  // Auto-advance: runs the progress line from where it stopped; when it fills, move to the next service
  useEffect(() => {
    if (paused) return
    const controls = (playback.current = animate(progress, 1, {
      duration: (1 - progress.get()) * ADVANCE_S,
      ease: 'linear',
      onComplete: () => {
        progress.set(0)
        setActive((i) => (i + 1) % items.length)
      },
    }))
    return () => controls.stop()
  }, [paused, active, progress])

  useEffect(() => () => clearTimeout(idleTimer.current), [])

  const restart = (i) => {
    playback.current?.stop() // otherwise it writes one more frame over the reset
    progress.set(0)
    setActive(i)
  }
  // Hover: switch without touching the current item's progress
  const show = (i) => i !== active && restart(i)

  // Click/tap: switch (or restart the same item) and pause auto-play until 10s of no clicks
  const select = (i) => {
    restart(i)
    setClicked(true)
    clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setClicked(false), IDLE_MS)
  }

  return (
    <section id="services" className="relative overflow-x-clip py-20 md:py-28">
      <div className="relative mx-auto max-w-[1280px] px-4 md:px-8">
        <span aria-hidden="true" className="watermark -top-4 left-0 md:-top-10">
          {services.watermark}
        </span>

        <motion.div
          variants={fadeUp}
          {...inView}
          className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="eyebrow">{services.eyebrow}</p>
            <h2 className="section-title mt-4">{services.title}</h2>
          </div>
          <p className="max-w-sm text-[15px] text-muted md:text-right">{services.intro}</p>
        </motion.div>

        {/* Mouse hover over the tour pauses auto-play (touch "hover" is ignored so taps don't pause it forever) */}
        <motion.div
          variants={fadeUp}
          {...inView}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHovering(true)}
          onPointerLeave={(e) => e.pointerType === 'mouse' && setHovering(false)}
          className="relative mt-12 grid gap-6 md:mt-16 md:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] md:gap-10 lg:gap-14"
        >
          <ServicePills active={active} onSelect={select} />
          <ServiceList active={active} progress={progress} reduced={reduced} onSelect={select} onHover={show} />
          <ServiceCard service={items[active]} reduced={reduced} onProject={(id) => focusProject(id, navigate)} />
        </motion.div>
      </div>
    </section>
  )
}
