import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { architectureText } from '../data/architecture'

const ACCENT = '#FF3131'
const ease = [0.22, 1, 0.36, 1]

// Draw-in timing (seconds): nodes pop in, then edges draw one by one, then the dot starts looping
const NODE_STEP = 0.05
const EDGE_START = 0.35
const EDGE_STEP = 0.2
const EDGE_DRAW = 0.45

const nodeById = (system, id) => system.nodes.find((n) => n.id === id)
const touches = (edge, id) => id && (edge[0] === id || edge[1] === id)

// Smooth S-curve between two node centres: horizontal-first when the gap is wider than tall
function curve(a, b) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  if (Math.abs(dx) >= Math.abs(dy)) {
    const mx = a.x + dx / 2
    return `M${a.x} ${a.y}C${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`
  }
  const my = a.y + dy / 2
  return `M${a.x} ${a.y}C${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y}`
}

// Pixel size of an element, kept up to date
function useSize(ref) {
  const [size, setSize] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: Math.round(width), h: Math.round(height) })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return size
}

function Tag({ children }) {
  return (
    <span className="inline-block rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold leading-tight text-grey">
      {children}
    </span>
  )
}

// Node card: white, grey border (thin red for AI steps); a red ring fades in while it is highlighted
function NodeCard({ node, lit, className = '' }) {
  return (
    <span
      className={`relative block rounded-xl border bg-paper px-3 py-2.5 text-left shadow-[0_6px_18px_-12px_rgba(0,0,0,0.25)] ${
        node.ai ? 'border-accent/60' : 'border-border'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-px rounded-xl border-2 border-accent transition-opacity duration-200 ${
          lit ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <span className="block text-[12px] font-semibold leading-snug text-ink-heading">{node.label}</span>
      <span className="mt-1.5 block">
        <Tag>{node.tag}</Tag>
      </span>
    </span>
  )
}

/* Desktop (lg+): nodes placed on the 0–100 grid, edges and the travelling dot in an SVG underneath */

function Diagram({ system, focused, onHover, onPick, reduced }) {
  const boxRef = useRef(null)
  const { w, h } = useSize(boxRef)
  const pathRef = useRef(null)
  const [track, setTrack] = useState(null)

  const pos = (id) => {
    const n = nodeById(system, id)
    return { x: (n.x / 100) * w, y: (n.y / 100) * h }
  }
  const mainD =
    w > 0
      ? system.mainPath
          .slice(1)
          .map((id, i) => curve(pos(system.mainPath[i]), pos(id)))
          .join(' ')
      : ''

  // Sample the main path so the dot can move with plain x/y transforms
  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path || !mainD || reduced) return setTrack(null)
    const length = path.getTotalLength()
    const points = Array.from({ length: 121 }, (_, i) => path.getPointAtLength((length * i) / 120))
    setTrack({ x: points.map((p) => p.x), y: points.map((p) => p.y), duration: Math.max(3, length / 170) })
  }, [mainD, reduced])

  const dotDelay = EDGE_START + system.edges.length * EDGE_STEP + EDGE_DRAW

  return (
    <div ref={boxRef} className="relative h-full w-full">
      {w > 0 && (
        <svg width={w} height={h} className="absolute inset-0" aria-hidden="true">
          <path ref={pathRef} d={mainD} fill="none" stroke="none" />

          {system.edges.map((edge, i) => {
            const [from, to, kind] = edge
            const d = curve(pos(from), pos(to))
            const lit = touches(edge, focused)
            const dim = focused && !lit
            const delay = EDGE_START + i * EDGE_STEP
            const dash = kind === 'tool' ? '5 5' : undefined
            return (
              <motion.g key={`${from}-${to}`} animate={{ opacity: dim ? 0.25 : 1 }} transition={{ duration: 0.2 }}>
                {dash ? (
                  <motion.path
                    d={d}
                    fill="none"
                    className="stroke-ink/[0.28]"
                    strokeWidth="1.5"
                    strokeDasharray={dash}
                    initial={reduced ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: EDGE_DRAW, delay }}
                  />
                ) : (
                  <motion.path
                    d={d}
                    fill="none"
                    className="stroke-ink/[0.22]"
                    strokeWidth="1.5"
                    initial={reduced ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: EDGE_DRAW, delay, ease: 'easeInOut' }}
                  />
                )}
                <path
                  d={d}
                  fill="none"
                  stroke={ACCENT}
                  strokeWidth="2"
                  strokeDasharray={dash}
                  className={`transition-opacity duration-200 ${lit ? 'opacity-100' : 'opacity-0'}`}
                />
              </motion.g>
            )
          })}

          {track && (
            <motion.g
              key={`${w}x${h}`}
              initial={{ x: track.x[0], y: track.y[0], opacity: 0 }}
              animate={{ x: track.x, y: track.y, opacity: [0, 1, 1, 1, 0] }}
              transition={{
                duration: track.duration,
                delay: dotDelay,
                repeat: Infinity,
                repeatDelay: 0.6,
                ease: 'linear',
              }}
            >
              <circle r="9" fill={ACCENT} opacity="0.2" />
              <circle r="4" fill={ACCENT} />
            </motion.g>
          )}
        </svg>
      )}

      {w > 0 &&
        system.nodes.map((node, i) => {
          const { x, y } = pos(node.id)
          const lit = focused === node.id
          const dim = focused && !lit && !system.edges.some((e) => touches(e, focused) && touches(e, node.id))
          return (
            <div
              key={node.id}
              className="absolute w-[132px] -translate-x-1/2 -translate-y-1/2 xl:w-[150px]"
              style={{ left: x, top: y }}
            >
              <motion.div
                initial={reduced ? false : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * NODE_STEP, ease }}
              >
                <motion.button
                  type="button"
                  aria-pressed={lit}
                  onMouseEnter={() => onHover(node.id)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(node.id)}
                  onBlur={() => onHover(null)}
                  onClick={() => onPick(node.id)}
                  className="block w-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  animate={{ opacity: dim ? 0.45 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <NodeCard node={node} lit={lit} />
                </motion.button>
              </motion.div>
            </div>
          )
        })}
    </div>
  )
}

function NotePanel({ system, node }) {
  return (
    <div aria-live="polite" className="flex min-h-[64px] items-center rounded-xl bg-surface-soft px-4 py-3">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={node?.id ?? 'system'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="text-[14px] leading-relaxed text-secondary"
        >
          {node ? (
            <>
              <span className="font-bold text-ink-heading">{node.label}</span>
              <span className="mx-2 text-accent">·</span>
              {node.note}
            </>
          ) : (
            <>
              {system.note && <span className="font-bold text-ink-heading">{system.note} </span>}
              <span className="text-muted">{architectureText.hint}</span>
            </>
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

/* Mobile (< lg): nodes stacked in a column, arrows between connected neighbours */

function Arrow({ dashed, delay, reduced }) {
  return (
    <svg width="14" height="30" viewBox="0 0 14 30" className="mx-auto my-1 block" aria-hidden="true">
      <motion.path
        d="M7 1V27"
        fill="none"
        className="stroke-ink/[0.3]"
        strokeWidth="1.5"
        strokeDasharray={dashed ? '3 4' : undefined}
        initial={reduced ? false : dashed ? { opacity: 0 } : { pathLength: 0 }}
        animate={dashed ? { opacity: 1 } : { pathLength: 1 }}
        transition={{ duration: 0.35, delay }}
      />
      <motion.path
        d="M2.5 23L7 28L11.5 23"
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: delay + 0.3 }}
      />
    </svg>
  )
}

function StackedFlow({ system, selected, onPick, reduced }) {
  const { nodes, edges } = system
  const edgeBetween = (a, b) => edges.find(([from, to]) => from === a && to === b)
  const label = (id) => nodeById(system, id).label

  return (
    <ol className="flex flex-col">
      {nodes.map((node, i) => {
        const prev = nodes[i - 1]
        const next = nodes[i + 1]
        const inEdge = prev && edgeBetween(prev.id, node.id)
        // Links that the column order can't show as an arrow are spelled out under the node
        const ins = edges.filter(([from, to]) => to === node.id && from !== prev?.id)
        const outs = edges.filter(([from, to]) => from === node.id && to !== next?.id)
        const lit = selected === node.id
        const delay = i * 0.08

        return (
          <li key={node.id} className={!inEdge && i > 0 ? 'mt-6' : ''}>
            {inEdge && <Arrow dashed={inEdge[2] === 'tool'} delay={delay} reduced={reduced} />}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay, ease }}
            >
              <button
                type="button"
                aria-expanded={lit}
                onClick={() => onPick(node.id)}
                className="block w-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                <NodeCard node={node} lit={lit} className="px-4 py-3" />
              </button>

              {(ins.length > 0 || outs.length > 0) && (
                <p className="mt-1.5 px-1 text-[11px] leading-relaxed text-grey">
                  {ins.map(([from, , kind]) => (
                    <span key={from} className="mr-3 inline-block">
                      ← {kind === 'tool' ? architectureText.usesLabel : architectureText.fromLabel} {label(from)}
                    </span>
                  ))}
                  {outs.map(([, to, kind]) => (
                    <span key={to} className="mr-3 inline-block">
                      → {kind === 'tool' ? architectureText.usesLabel : architectureText.toLabel} {label(to)}
                    </span>
                  ))}
                </p>
              )}

              <AnimatePresence initial={false}>
                {lit && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.2 }}
                    aria-live="polite"
                    className="mt-2 rounded-lg border-l-2 border-accent bg-surface-soft px-3 py-2 text-[13px] leading-relaxed text-secondary"
                  >
                    {node.note}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </li>
        )
      })}
    </ol>
  )
}

// "How it works" block on a project page: the diagram (lg+) or a stacked flow (mobile), with the
// hovered/tapped node's note underneath. `system` is one entry of data/architecture.js.
export default function ArchitectureDiagram({ system }) {
  const reduced = useReducedMotion()
  const [hovered, setHovered] = useState(null)
  const [picked, setPicked] = useState(null)
  const focused = hovered ?? picked
  const pick = (id) => setPicked((current) => (current === id ? null : id))
  // The block sits far down the page: mount the animated parts once it scrolls into view so the draw-in is seen
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, amount: 0.25 })

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-border bg-paper p-4 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.18)] md:p-6"
    >
      <div className="hidden lg:block">
        <div className="h-[260px]">
          {visible && (
            <Diagram system={system} focused={focused} onHover={setHovered} onPick={pick} reduced={reduced} />
          )}
        </div>
        <div className="mt-4">
          <NotePanel system={system} node={focused && nodeById(system, focused)} />
        </div>
      </div>

      <div className="lg:hidden">
        <p className="mb-5 text-[14px] leading-relaxed text-secondary">
          {system.note && <span className="font-bold text-ink-heading">{system.note} </span>}
          <span className="text-muted">{architectureText.hint}</span>
        </p>
        {visible && <StackedFlow system={system} selected={picked} onPick={pick} reduced={reduced} />}
      </div>
    </div>
  )
}
