import { useRef, useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { timeline } from '../data/timeline'

const { items } = timeline
const last = items.length - 1

// `image` is a path under src/assets/; the glob keeps missing files from breaking the build
const assetImages = Object.fromEntries(
  Object.entries(
    import.meta.glob('../assets/{journey,projects}/*.{jpg,jpeg,png,webp}', {
      eager: true,
      import: 'default',
    }),
  ).map(([path, src]) => [path.replace('../assets/', ''), src]),
)
const imageFor = (item) => (item.image && assetImages[item.image]) || null

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.3 } }

// Lines the first card up with the 1280px page container (--pad is the container's side padding)
const trackPadding = 'max(var(--pad), calc((100vw - 1280px) / 2 + var(--pad)))'

function NavButton({ label, Icon, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-ink text-ink transition-colors hover:bg-dark hover:text-white disabled:pointer-events-none disabled:opacity-25"
    >
      <Icon size={18} />
    </button>
  )
}

function TimelineCard({ item }) {
  const image = imageFor(item)

  return (
    <article className="group w-[80vw] shrink-0 snap-start sm:w-[380px]">
      <div className="flex items-baseline gap-3">
        <p className="text-[48px] font-bold leading-none tracking-tight text-accent md:text-[64px]">{item.id}</p>
        {item.year && (
          <span className="text-stat-label uppercase tracking-stat text-muted">{item.year}</span>
        )}
      </div>
      <div className="relative mt-5 aspect-[380/238] overflow-hidden rounded-card bg-[radial-gradient(circle_at_30%_20%,#3a3a3a,#111_75%)]">
        {image && (
          <img
            src={image}
            alt=""
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover transition-[filter,transform] duration-500 [filter:grayscale(100%)_contrast(1.1)] group-hover:scale-[1.03] group-hover:[filter:none]"
          />
        )}
      </div>
      <h3 className="mt-5 text-[20px] font-bold leading-snug text-ink-heading">{item.title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{item.subtitle}</p>
    </article>
  )
}

export default function Timeline() {
  const trackRef = useRef(null)
  const drag = useRef(null)
  // Where a smooth scroll is heading, so quick repeated clicks/keys keep stepping.
  // `index` is the dot that was clicked, shown as active even when it shares the end position.
  const pending = useRef({ left: 0, time: 0, index: null })
  const [active, setActive] = useState(0)
  const [edges, setEdges] = useState({ start: true, end: false })
  const [dragging, setDragging] = useState(false)
  const { scrollXProgress } = useScroll({ container: trackRef })

  // Scroll position that snaps card i to the start; the last few cards share the end position
  const offsetOf = (i) => {
    const el = trackRef.current
    const list = el.children
    const max = el.scrollWidth - el.clientWidth
    const left = list[i].offsetLeft - list[0].offsetLeft
    return max - left < 16 ? max : left
  }
  const nearest = (left) => {
    let best = 0
    items.forEach((_, i) => {
      if (Math.abs(offsetOf(i) - left) < Math.abs(offsetOf(best) - left)) best = i
    })
    return best
  }

  const scrollToLeft = (left, index = null) => {
    pending.current = { left, time: Date.now(), index }
    trackRef.current.scrollTo({ left, behavior: 'smooth' })
  }
  const goTo = (index) => {
    setActive(index) // no scroll event fires when the target is already the current position
    scrollToLeft(offsetOf(index), index)
  }
  const clearClicked = () => {
    pending.current.index = null
  }

  // Next distinct stop before/after `from`, or `from` itself at either end
  const stopFrom = (from, delta) => {
    const stops = items.map((_, i) => offsetOf(i))
    const target = delta > 0 ? stops.find((s) => s > from + 8) : stops.reverse().find((s) => s < from - 8)
    return target ?? from
  }
  const step = (delta) => {
    const { left, time } = pending.current
    scrollToLeft(stopFrom(Date.now() - time < 600 ? left : trackRef.current.scrollLeft, delta))
  }

  const onScroll = () => {
    const el = trackRef.current
    const max = el.scrollWidth - el.clientWidth
    const end = el.scrollLeft >= max - 2
    // Near the end the last cards can't reach the snap line, so the end position counts as the last card
    setActive(end ? (pending.current.index ?? last) : nearest(el.scrollLeft))
    setEdges({ start: el.scrollLeft <= 2, end })
  }

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    step(e.key === 'ArrowRight' ? 1 : -1)
  }

  // Mouse drag-to-scroll; touch and pens keep native swiping
  const onPointerDown = (e) => {
    clearClicked()
    if (e.pointerType !== 'mouse' || e.button !== 0) return
    const el = trackRef.current
    drag.current = { x: e.clientX, left: el.scrollLeft }
    el.style.scrollSnapType = 'none' // snapping would fight the drag
    el.setPointerCapture(e.pointerId)
    setDragging(true)
  }
  const onPointerMove = (e) => {
    if (!drag.current) return
    trackRef.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x)
  }
  const endDrag = () => {
    if (!drag.current) return
    const el = trackRef.current
    const start = offsetOf(nearest(drag.current.left))
    const moved = el.scrollLeft - drag.current.left
    drag.current = null
    setDragging(false)
    // Re-enable snapping once the glide ends; doing it now would resnap and cut the glide short
    const restoreSnap = () => {
      if (!drag.current) el.style.scrollSnapType = '' // a new drag may have started meanwhile
    }
    el.addEventListener('scrollend', restoreSnap, { once: true })
    setTimeout(restoreSnap, 900)
    const target = offsetOf(nearest(el.scrollLeft))
    // A short drag still moves one card in the drag direction
    scrollToLeft(target === start && Math.abs(moved) > 40 ? stopFrom(start, moved) : target)
  }

  return (
    <section id="journey" className="relative overflow-x-clip py-20 md:py-28">
      <div className="relative mx-auto max-w-[1280px] px-4 md:px-8">
        <span aria-hidden="true" className="watermark -top-4 left-0 md:-top-10">
          {timeline.watermark}
        </span>

        <motion.div
          variants={fadeUp}
          {...inView}
          className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="eyebrow">{timeline.eyebrow}</p>
            <h2 className="section-title mt-4">{timeline.title}</h2>
          </div>
          <div className="flex items-end justify-between gap-6 md:justify-end">
            <p className="max-w-sm text-[15px] text-muted md:text-right">{timeline.intro}</p>
            <div className="flex shrink-0 gap-2">
              <NavButton label="Previous card" Icon={ArrowLeft} onClick={() => step(-1)} disabled={edges.start} />
              <NavButton label="Next card" Icon={ArrowRight} onClick={() => step(1)} disabled={edges.end} />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} {...inView} className="mt-12">
        <div
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={timeline.title}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onWheel={clearClicked}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={{ paddingInline: trackPadding, scrollPaddingInline: trackPadding }}
          className={`no-scrollbar relative flex snap-x snap-mandatory gap-8 overflow-x-auto pb-2 outline-none [--pad:1rem] focus-visible:ring-2 focus-visible:ring-accent/30 md:[--pad:2rem] ${
            dragging ? 'cursor-grabbing select-none' : 'md:cursor-grab'
          }`}
        >
          {items.map((item) => (
            <TimelineCard key={item.id} item={item} />
          ))}
        </div>
      </motion.div>

      <div className="mx-auto mt-10 flex max-w-[1280px] flex-col gap-5 px-4 sm:flex-row sm:items-center sm:gap-8 md:px-8">
        <div className="h-px flex-1 bg-border">
          <motion.div style={{ scaleX: scrollXProgress }} className="h-px origin-left bg-accent" />
        </div>

        <ol className="flex flex-wrap items-center gap-3 sm:gap-4">
          {items.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to ${item.id}: ${item.title}`}
                aria-current={i === active ? 'step' : undefined}
                className={`group flex items-center gap-1.5 text-[11px] font-bold tracking-[1px] transition-colors ${
                  i === active ? 'text-accent' : 'text-muted hover:text-ink'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i === active ? 'bg-accent' : 'bg-border group-hover:bg-ink'
                  }`}
                />
                {item.id}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
