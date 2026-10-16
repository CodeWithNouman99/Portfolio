import { useEffect, useId, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Mini animated scenes for the Services rows (320×200 viewBox, scale to their container).
// They only mount while their row is open, loop until it closes, and only animate transform,
// opacity and pathLength. With reduced motion they render their final frame and stay still.
// Drawn for a light panel (#F9F9F9): dark windows/nodes, grey connectors, ink labels.

const ACCENT = '#FF3131'
const PANEL = '#1c1c1c'
const BUBBLE = '#2a2a2a'
const LINE = 'rgba(255,255,255,0.14)'
const ease = [0.22, 1, 0.36, 1]
const centered = { transformBox: 'fill-box', transformOrigin: 'center' }

// Remounts the scene every `ms` so one-shot sequences replay while the row stays open
function useCycle(ms, reduced) {
  const [cycle, setCycle] = useState(0)
  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setCycle((c) => c + 1), ms)
    return () => clearInterval(id)
  }, [ms, reduced])
  return cycle
}

// Fade/slide in after `delay` seconds; with reduced motion starts at the final state
const appear = (reduced, delay, from = { opacity: 0, y: 6 }) => ({
  initial: reduced ? false : from,
  animate: { opacity: 1, x: 0, y: 0, scale: 1 },
  transition: { duration: 0.45, delay, ease },
})

function Frame({ children, label }) {
  return (
    <svg viewBox="0 0 320 200" className="h-full w-full" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

/* 01 · code editor typing, then a browser frame with the rendered card */

const CHAR_W = 5.15
const codeLines = [
  [['const', true], [' app = express()']],
  [["app.get('/api/doctors',"]],
  [['  '], ['async', true], [' (req, res) => {']],
  [['  res.json('], ['await', true], [' find())']],
  [['})']],
  [['<'], ['DoctorCard', true], [' doctor={d} />']],
]
const LINE_START = 0.3
const LINE_STEP = 0.42
const LINE_TYPE = 0.35

function CodeScene({ reduced }) {
  const cycle = useCycle(6500, reduced)
  const id = useId().replace(/:/g, '')
  const lines = codeLines.map((segments, i) => ({
    segments,
    y: 50 + i * 18,
    width: segments.reduce((sum, [text]) => sum + text.length, 0) * CHAR_W,
    start: LINE_START + i * LINE_STEP,
  }))

  // Cursor keyframes: jump to each line's start, glide to its end while it "types"
  const last = lines.at(-1)
  const total = last.start + LINE_TYPE
  const cursor = { x: [], y: [], times: [] }
  lines.forEach((line) => {
    cursor.x.push(22, 22 + line.width + 2)
    cursor.y.push(line.y, line.y)
    cursor.times.push(line.start / total, (line.start + LINE_TYPE) / total)
  })
  cursor.x.unshift(22)
  cursor.y.unshift(lines[0].y)
  cursor.times.unshift(0)

  return (
    <Frame label="A code editor typing an Express route, then the rendered app in a browser">
      <g key={cycle}>
        <rect x="8" y="12" width="200" height="156" rx="8" fill={PANEL} stroke={LINE} />
        <circle cx="21" cy="25" r="3" fill={ACCENT} />
        <circle cx="31" cy="25" r="3" fill="rgba(255,255,255,0.25)" />
        <circle cx="41" cy="25" r="3" fill="rgba(255,255,255,0.12)" />

        {lines.map((line, i) => (
          <g key={i}>
            <clipPath id={`${id}-l${i}`}>
              <motion.rect
                x="22"
                y={line.y - 9}
                width={line.width + 2}
                height="12"
                style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
                initial={reduced ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: LINE_TYPE, delay: line.start, ease: 'linear' }}
              />
            </clipPath>
            <text
              x="22"
              y={line.y}
              clipPath={`url(#${id}-l${i})`}
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="8.6"
              fill="rgba(255,255,255,0.78)"
              xmlSpace="preserve"
            >
              {line.segments.map(([text, red], j) => (
                <tspan key={j} fill={red ? ACCENT : undefined}>
                  {text}
                </tspan>
              ))}
            </text>
          </g>
        ))}

        <motion.g
          initial={reduced ? false : { x: cursor.x[0], y: cursor.y[0] }}
          animate={reduced ? { x: cursor.x.at(-1), y: cursor.y.at(-1) } : { x: cursor.x, y: cursor.y, opacity: [1, 0, 1] }}
          transition={{
            x: { duration: total, times: cursor.times, ease: 'linear' },
            y: { duration: total, times: cursor.times, ease: 'linear' },
            opacity: { duration: 0.9, repeat: Infinity, ease: 'linear' },
          }}
        >
          <rect width="5" height="10" y="-8.5" fill={ACCENT} />
        </motion.g>

        <motion.g {...appear(reduced, total + 0.25, { opacity: 0, x: 30 })}>
          <rect x="150" y="70" width="162" height="122" rx="8" className="fill-paper stroke-border" />
          <path d="M150 78a8 8 0 0 1 8-8h146a8 8 0 0 1 8 8v8H150z" className="fill-surface" />
          <circle cx="160" cy="78" r="2.2" fill="#d4d4d4" />
          <circle cx="167" cy="78" r="2.2" fill="#d4d4d4" />
          <rect x="178" y="75" width="80" height="6" rx="3" className="fill-border" />

          <motion.g {...appear(reduced, total + 0.6)}>
            <rect x="162" y="96" width="138" height="84" rx="6" className="fill-paper stroke-border" />
            <circle cx="180" cy="114" r="9" fill="rgba(255,49,49,0.18)" />
            <rect x="195" y="108" width="62" height="6" rx="3" className="fill-ink" />
            <rect x="195" y="118" width="40" height="5" rx="2.5" fill="#d4d4d4" />
            <rect x="172" y="134" width="118" height="5" rx="2.5" className="fill-border" />
            <rect x="172" y="143" width="90" height="5" rx="2.5" className="fill-border" />
            <rect x="172" y="156" width="46" height="16" rx="8" fill={ACCENT} />
            <text x="195" y="167" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff">
              Book
            </text>
          </motion.g>
        </motion.g>
      </g>
    </Frame>
  )
}

/* 02 · n8n flow: nodes, lines drawing in, a red dot travelling the path */

const flowNodes = [
  { label: 'Webhook', x: 44, y: 58 },
  { label: 'AI', x: 102, y: 142, accent: true },
  { label: 'Sheets', x: 160, y: 58 },
  { label: 'Gmail', x: 218, y: 142 },
  { label: 'WhatsApp', x: 276, y: 58 },
]
const flowPath = flowNodes
  .map((n, i) => {
    if (i === 0) return `M${n.x} ${n.y}`
    const p = flowNodes[i - 1]
    return `C${p.x + 34} ${p.y} ${n.x - 34} ${n.y} ${n.x} ${n.y}`
  })
  .join(' ')

function FlowScene({ reduced }) {
  const pathRef = useRef(null)
  const [track, setTrack] = useState(null)

  // Sample the path once so the dot can move with plain x/y transforms
  useEffect(() => {
    const path = pathRef.current
    if (!path || reduced) return
    const length = path.getTotalLength()
    const points = Array.from({ length: 61 }, (_, i) => path.getPointAtLength((length * i) / 60))
    setTrack({ x: points.map((p) => p.x), y: points.map((p) => p.y) })
  }, [reduced])

  return (
    <Frame label="An n8n workflow: Webhook, AI, Sheets, Gmail and WhatsApp nodes connected in a flow">
      <motion.path
        ref={pathRef}
        d={flowPath}
        fill="none"
        className="stroke-ink/[0.22]"
        strokeWidth="1.5"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.5, ease: 'easeInOut' }}
      />

      {track && (
        <motion.g
          initial={{ x: track.x[0], y: track.y[0], opacity: 0 }}
          animate={{ x: track.x, y: track.y, opacity: [0, 1, 1, 1, 0] }}
          transition={{ duration: 2.6, delay: 1.9, repeat: Infinity, repeatDelay: 0.4, ease: 'linear' }}
        >
          <circle r="9" fill={ACCENT} opacity="0.22" />
          <circle r="4" fill={ACCENT} />
        </motion.g>
      )}

      {flowNodes.map((node, i) => (
        <motion.g
          key={node.label}
          style={centered}
          initial={reduced ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.1, ease }}
        >
          <rect
            x={node.x - 30}
            y={node.y - 14}
            width="60"
            height="28"
            rx="9"
            fill={PANEL}
            stroke={node.accent ? ACCENT : 'rgba(255,255,255,0.22)'}
          />
          <text x={node.x} y={node.y + 3.2} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
            {node.label}
          </text>
        </motion.g>
      ))}
    </Frame>
  )
}

/* 03 · RAG chat: question, typing dots, answer with its source */

function ChatScene({ reduced }) {
  const cycle = useCycle(6000, reduced)

  return (
    <Frame label="A chat where an assistant answers a question and cites hospital-guide.pdf as its source">
      <rect x="8" y="8" width="304" height="184" rx="10" fill={PANEL} stroke={LINE} />
      <circle cx="24" cy="24" r="4" fill={ACCENT} />
      <text x="34" y="27" fontSize="9" fontWeight="700" fill="rgba(255,255,255,0.8)">
        Hospital assistant
      </text>
      <line x1="8" y1="38" x2="312" y2="38" stroke={LINE} />

      <g key={cycle}>
        <motion.g {...appear(reduced, 0.3)}>
          <rect x="146" y="48" width="152" height="36" rx="10" fill={ACCENT} />
          <text fontSize="9" fill="#fff">
            <tspan x="157" y="63">Which documents do I need</tspan>
            <tspan x="157" y="75">for admission?</tspan>
          </text>
        </motion.g>

        {!reduced && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, delay: 1.0, times: [0, 0.12, 0.88, 1] }}
          >
            <rect x="20" y="96" width="48" height="24" rx="10" fill={BUBBLE} />
            {[33, 44, 55].map((cx, i) => (
              <motion.circle
                key={cx}
                cx={cx}
                cy="108"
                r="2.6"
                fill="rgba(255,255,255,0.7)"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
              />
            ))}
          </motion.g>
        )}

        <motion.g {...appear(reduced, 2.5)}>
          <rect x="20" y="96" width="196" height="40" rx="10" fill={BUBBLE} />
          <text fontSize="9" fill="rgba(255,255,255,0.85)">
            <tspan x="31" y="112">Bring your ID card and the</tspan>
            <tspan x="31" y="125">referral letter to reception.</tspan>
          </text>
        </motion.g>

        <motion.g {...appear(reduced, 3.0)}>
          <rect x="20" y="144" width="132" height="18" rx="9" fill="none" stroke="rgba(255,49,49,0.6)" />
          <text x="30" y="156" fontSize="8" fontWeight="700" fill={ACCENT}>
            source: hospital-guide.pdf
          </text>
        </motion.g>
      </g>
    </Frame>
  )
}

/* 04 · three agents pass a task around, then the team is ready */

const agents = [
  { label: 'Parser', x: 160, y: 46 },
  { label: 'Matcher', x: 262, y: 128 },
  { label: 'Scorer', x: 58, y: 128 },
]
const HOP = 3.2 // seconds for the task to visit all three agents
// When the chip sits on each agent, as a fraction of HOP
const arrivals = [0.08, 0.45, 0.8]

function AgentsScene({ reduced }) {
  const cycle = useCycle(5200, reduced)
  const [p, m, s] = agents

  return (
    <Frame label="Three AI agents, Parser, Matcher and Scorer, pass a task between them until the team is ready">
      <path
        d={`M${p.x} ${p.y}L${m.x} ${m.y}L${s.x} ${s.y}Z`}
        fill="none"
        className="stroke-ink/20"
        strokeDasharray="4 5"
      />

      {agents.map((agent) => (
        <g key={agent.label}>
          <circle cx={agent.x} cy={agent.y} r="24" fill={PANEL} stroke="rgba(255,255,255,0.3)" />
          <circle cx={agent.x} cy={agent.y} r="4" fill="rgba(255,255,255,0.5)" />
          <text x={agent.x} y={agent.y + 40} textAnchor="middle" fontSize="9" fontWeight="700" className="fill-ink">
            {agent.label}
          </text>
        </g>
      ))}

      <g key={cycle}>
        {!reduced && (
          <>
            {agents.map((agent, i) => (
              <motion.circle
                key={agent.label}
                cx={agent.x}
                cy={agent.y}
                r="24"
                fill="none"
                stroke={ACCENT}
                strokeWidth="2"
                style={centered}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: [0, 0.9, 0], scale: [1, 1.15, 1.5] }}
                transition={{ duration: 0.8, delay: arrivals[i] * HOP, ease: 'easeOut' }}
              />
            ))}

            <motion.g
              initial={{ x: p.x, y: p.y, opacity: 0 }}
              animate={{
                x: [p.x, p.x, m.x, m.x, s.x, s.x],
                y: [p.y, p.y, m.y, m.y, s.y, s.y],
                opacity: [0, 1, 1, 1, 1, 0],
              }}
              transition={{ duration: HOP + 0.3, times: [0, arrivals[0], arrivals[1], 0.6, arrivals[2], 1], ease: 'easeInOut' }}
            >
              <rect x="-19" y="-8" width="38" height="16" rx="8" fill={ACCENT} />
              <text y="3" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff">
                task
              </text>
            </motion.g>
          </>
        )}

        <motion.g style={centered} {...appear(reduced, HOP + 0.4, { opacity: 0, scale: 0.8 })}>
          <rect x="118" y="100" width="84" height="22" rx="11" fill="#111" />
          <text x="160" y="114.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">
            Team ready ✓
          </text>
        </motion.g>
      </g>
    </Frame>
  )
}

const scenes = { code: CodeScene, flow: FlowScene, chat: ChatScene, agents: AgentsScene }

export default function ServiceIllustration({ type, reduced }) {
  const Scene = scenes[type]
  return Scene ? <Scene reduced={reduced} /> : null
}
