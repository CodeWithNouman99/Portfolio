import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Code2, MessageSquareText, Minus, Network, Play, Plus, Sparkles, Workflow, Zap } from 'lucide-react'
import { services } from '../data/services'
import { projects } from '../data/projects'
import { focusProject } from '../lib/focusProject'
import { openChat } from '../lib/openChat'

const { items, trigger, router, panel } = services
const ICONS = { workflow: Workflow, chat: MessageSquareText, agents: Network, code: Code2 }
const SUCCESS = '#16A34A' // "Active", "success", "✓ 4 outputs"

// Canvas geometry (design units; the stage is scaled down to fit narrower canvases)
const STAGE_W = 720
const STAGE_H = 376
const MID_Y = STAGE_H / 2
const TRIGGER = { x: 20, size: 80 }
const ROUTER = { x: 136, w: 182, h: 92 }
const NODE = { x: 410, w: 300, h: 72, gap: 16 }
const NODES_TOP = (STAGE_H - (items.length * NODE.h + (items.length - 1) * NODE.gap)) / 2
const nodeTop = (i) => NODES_TOP + i * (NODE.h + NODE.gap)
const ROUTER_OUT_X = ROUTER.x + ROUTER.w
const BEND = (NODE.x - ROUTER_OUT_X) / 2

const TRIGGER_WIRE = `M ${TRIGGER.x + TRIGGER.size} ${MID_Y} L ${ROUTER.x} ${MID_Y}`
const nodeWire = (i) => {
  const y = nodeTop(i) + NODE.h / 2
  return `M ${ROUTER_OUT_X} ${MID_Y} C ${ROUTER_OUT_X + BEND} ${MID_Y}, ${NODE.x - BEND} ${y}, ${NODE.x} ${y}`
}

// Opaque accent tint, so wires and grid dots don't show through the nodes
const ACCENT_TINT = 'bg-[color-mix(in_srgb,#FF3131_12%,rgb(var(--paper)))]'
const WIRE = 'fill-none stroke-border'
// Reduced motion: plain accent line (no dashes, no animation)
const WIRE_LIVE = 'fill-none stroke-accent motion-safe:animate-wire-dash motion-safe:[stroke-dasharray:6_6]'
const FOCUS_RING =
  'outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper'
const DOTS = {
  backgroundImage: 'radial-gradient(rgb(var(--border)) 1.5px, transparent 1.5px)',
  backgroundSize: '20px 20px',
}

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

// Scale factor that fits STAGE_W into the element's width (never above 1)
function useStageScale(ref) {
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      if (width > 0) setScale(Math.min(1, width / STAGE_W))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return scale
}

// Small ring where a wire meets a node
function Port({ side, active }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 bg-paper ${
        side === 'left' ? '-left-[5px]' : '-right-[5px]'
      } ${active ? 'border-accent' : 'border-grey/50'}`}
    />
  )
}

function TriggerTile({ className = '', children }) {
  return (
    <span
      className={`relative flex items-center justify-center rounded-l-[28px] rounded-r-lg border border-border bg-surface text-accent ${className}`}
    >
      <Zap size={30} strokeWidth={2} fill="currentColor" aria-hidden="true" />
      {children}
    </span>
  )
}

function RouterCard({ className = '' }) {
  return (
    <div className={`relative flex items-center gap-3 rounded-xl border-2 border-accent px-3 ${ACCENT_TINT} ${className}`}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent text-white">
        <Sparkles size={22} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-bold leading-tight text-ink-heading">{router.label}</span>
        <span className="mt-1 block whitespace-nowrap text-[11px] leading-tight text-muted">{router.sub}</span>
      </span>
      <Port side="left" active />
      <Port side="right" active />
    </div>
  )
}

const outputsLabel = `✓ ${items.length} outputs`

function ServiceNode({ service, index, selected, onSelect, onKeyDown, buttonRef, idPrefix, className = '', style }) {
  const Icon = ICONS[service.icon] ?? Workflow
  return (
    <button
      ref={buttonRef}
      id={`${idPrefix}-${service.id}`}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls="service-panel"
      tabIndex={selected ? 0 : -1}
      onClick={() => onSelect(index)}
      onKeyDown={(e) => onKeyDown(e, index)}
      style={style}
      className={`flex items-center gap-3 rounded-xl border px-3 text-left transition-colors ${FOCUS_RING} ${
        selected ? `border-accent ${ACCENT_TINT}` : 'border-border bg-surface hover:border-grey/40'
      } ${className}`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
          selected ? 'bg-accent text-white' : 'border border-border bg-paper text-ink'
        }`}
      >
        <Icon size={20} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold leading-tight text-ink-heading">{service.title}</span>
        <span className="mt-1 block text-[12px] leading-tight text-muted">{service.sub}</span>
      </span>
      <span className={`shrink-0 font-mono text-[11px] ${selected ? 'font-bold text-accent' : 'text-grey'}`}>
        {service.id}
      </span>
      <Port side="left" active={selected} />
    </button>
  )
}

// Arrow Up/Down (and Home/End) move between nodes; selection follows focus
function useNodeKeys(onSelect) {
  const refs = useRef([])
  const onKeyDown = (e, i) => {
    const last = items.length - 1
    const next = { ArrowDown: i === last ? 0 : i + 1, ArrowUp: i === 0 ? last : i - 1, Home: 0, End: last }[e.key]
    if (next === undefined) return
    e.preventDefault()
    onSelect(next)
    refs.current[next]?.focus()
  }
  return { refs, onKeyDown }
}

// Desktop: free-form canvas with absolutely positioned nodes and an SVG wire layer
function Stage({ active, onSelect }) {
  const wrapRef = useRef(null)
  const scale = useStageScale(wrapRef)
  const { refs, onKeyDown } = useNodeKeys(onSelect)

  return (
    <div ref={wrapRef} className="relative w-full" style={{ height: STAGE_H * scale }}>
      <div
        className="absolute left-1/2 top-0 origin-top"
        style={{ width: STAGE_W, height: STAGE_H, transform: `translateX(-50%) scale(${scale})` }}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          width={STAGE_W}
          height={STAGE_H}
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
        >
          {items.map((service, i) => i !== active && <path key={service.id} d={nodeWire(i)} strokeWidth="2" className={WIRE} />)}
          <path d={TRIGGER_WIRE} strokeWidth="2" className={WIRE_LIVE} />
          <path d={nodeWire(active)} strokeWidth="2" className={WIRE_LIVE} />
        </svg>

        {/* Trigger */}
        <div className="absolute" style={{ left: TRIGGER.x, top: MID_Y - TRIGGER.size / 2, width: TRIGGER.size }}>
          <TriggerTile className="h-20 w-20">
            <Port side="right" active />
          </TriggerTile>
          <div className="absolute left-1/2 top-full mt-2.5 w-32 -translate-x-1/2 text-center">
            <p className="text-[13px] font-semibold leading-tight text-ink-heading">{trigger.label}</p>
            <p className="mt-1 text-[11px] leading-tight text-muted">{trigger.sub}</p>
          </div>
        </div>

        {/* Router */}
        <div className="absolute" style={{ left: ROUTER.x, top: MID_Y - ROUTER.h / 2, width: ROUTER.w }}>
          <RouterCard className="h-[92px]" />
          <p className="mt-2.5 text-center font-mono text-[12px]" style={{ color: SUCCESS }}>
            {outputsLabel}
          </p>
        </div>

        {/* Services */}
        <div role="tablist" aria-label={services.eyebrow} aria-orientation="vertical">
          {items.map((service, i) => (
            <ServiceNode
              key={service.id}
              service={service}
              index={i}
              selected={i === active}
              onSelect={onSelect}
              onKeyDown={onKeyDown}
              buttonRef={(el) => (refs.current[i] = el)}
              idPrefix="service-node"
              className="absolute"
              style={{ left: NODE.x, top: nodeTop(i), width: NODE.w, height: NODE.h }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Mobile: trigger → router → node list, joined by short accent lines
function MobileFlow({ active, onSelect }) {
  const { refs, onKeyDown } = useNodeKeys(onSelect)
  const line = <span aria-hidden="true" className="ml-[27px] block h-6 w-0.5 bg-accent" />

  return (
    <div className="p-4">
      <div className="flex items-center gap-3">
        <TriggerTile className="h-14 w-14 shrink-0" />
        <div>
          <p className="text-[14px] font-semibold leading-tight text-ink-heading">{trigger.label}</p>
          <p className="mt-1 text-[12px] leading-tight text-muted">{trigger.sub}</p>
        </div>
      </div>
      {line}
      <RouterCard className="h-[72px] w-full" />
      <div className="flex items-center gap-3">
        {line}
        <p className="font-mono text-[12px]" style={{ color: SUCCESS }}>
          {outputsLabel}
        </p>
      </div>
      <div role="tablist" aria-label={services.eyebrow} aria-orientation="vertical" className="flex flex-col gap-2.5">
        {items.map((service, i) => (
          <ServiceNode
            key={service.id}
            service={service}
            index={i}
            selected={i === active}
            onSelect={onSelect}
            onKeyDown={onKeyDown}
            buttonRef={(el) => (refs.current[i] = el)}
            idPrefix="service-node-m"
            className="relative h-[72px] w-full"
          />
        ))}
      </div>
    </div>
  )
}

function Canvas({ active, onSelect, reduced }) {
  const runWorkflow = () =>
    document.getElementById('projects')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })

  return (
    <div className="min-w-0 overflow-hidden rounded-[20px] border border-border bg-paper" style={DOTS}>
      {/* Editor tab bar */}
      <div className="flex items-center gap-3 border-b border-border bg-paper px-4 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="h-2.5 w-2.5 rounded-full bg-border" />
          ))}
        </span>
        <span className="min-w-0 truncate font-mono text-[12px] text-grey">{services.file}</span>
        <span className="ml-auto flex shrink-0 items-center gap-2 font-mono text-[12px] text-grey">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping" style={{ background: SUCCESS }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: SUCCESS }} />
          </span>
          {services.status}
        </span>
      </div>

      <div className="hidden px-4 pb-2 pt-8 md:block lg:px-6">
        <Stage active={active} onSelect={onSelect} />
      </div>
      <div className="md:hidden">
        <MobileFlow active={active} onSelect={onSelect} />
      </div>

      <div className="flex items-center justify-between gap-3 px-4 pb-4 md:px-5 md:pb-5">
        {/* Decorative zoom controls, like an editor canvas */}
        <span aria-hidden="true" className="hidden gap-1.5 md:flex">
          {[Plus, Minus].map((Icon, i) => (
            <span key={i} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-paper text-grey">
              <Icon size={15} />
            </span>
          ))}
        </span>
        <button
          type="button"
          onClick={runWorkflow}
          className={`ml-auto inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-accent/90 ${FOCUS_RING}`}
        >
          <Play size={13} fill="currentColor" aria-hidden="true" />
          {services.execute}
        </button>
      </div>
    </div>
  )
}

function NodePanel({ service, reduced, onProject }) {
  const Icon = ICONS[service.icon] ?? Workflow
  const links = resolveLinks(service.links)
  const label = 'text-stat-label uppercase tracking-stat text-muted'

  return (
    <div
      id="service-panel"
      role="tabpanel"
      aria-labelledby="service-panel-title"
      className="min-w-0 rounded-[20px] border border-border bg-paper p-5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.18)] md:p-6"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={service.id}
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
          exit={reduced ? { opacity: 1 } : { opacity: 0, y: -6, transition: { duration: 0.15, ease: 'easeIn' } }}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white">
              <Icon size={15} aria-hidden="true" />
            </span>
            <span className="eyebrow">
              {panel.node} {service.id}
            </span>
            <span className="ml-auto font-mono text-[12px]" style={{ color: SUCCESS }}>
              ● {panel.status}
            </span>
          </div>

          <h3 id="service-panel-title" className="mt-5 text-[24px] font-bold leading-tight md:text-[26px]">
            {service.title}
          </h3>
          <p className="mt-3 text-[15px] leading-[1.7]">{service.description}</p>

          <p className={`mt-6 ${label}`}>{panel.parameters}</p>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label={panel.parameters}>
            {service.chips.map((chip) => (
              <li key={chip} className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-[12px] text-ink">
                {chip}
              </li>
            ))}
          </ul>

          <p className={`mt-6 ${label}`}>{panel.output}</p>
          <ul className="mt-2">
            {links.map((link) => (
              <li key={link.key} className="border-b border-border last:border-b-0">
                <button
                  type="button"
                  onClick={() => (link.chat ? openChat() : onProject(link.project.id))}
                  className={`group/link flex w-full items-center justify-between gap-3 rounded-sm py-3 text-left text-[14px] font-semibold text-ink-heading transition-colors hover:text-accent ${FOCUS_RING}`}
                >
                  {link.label}
                  <ArrowUpRight
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 text-accent transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                  />
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function Services() {
  const reduced = useReducedMotion()
  const navigate = useNavigate()
  const [active, setActive] = useState(0)

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
            <h2 className="section-title mt-4 max-w-[760px]">{services.title}</h2>
          </div>
          <p className="max-w-sm text-[15px] text-muted md:text-right">{services.intro}</p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          {...inView}
          className="relative mt-12 grid gap-6 md:mt-16 lg:grid-cols-[minmax(0,1fr)_340px]"
        >
          <Canvas active={active} onSelect={setActive} reduced={reduced} />
          <NodePanel service={items[active]} reduced={reduced} onProject={(id) => focusProject(id, navigate)} />
        </motion.div>
      </div>
    </section>
  )
}
