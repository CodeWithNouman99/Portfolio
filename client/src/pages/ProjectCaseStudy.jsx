import { useEffect, useRef, useState } from 'react'
import { peekHomeScroll } from '../lib/homeScroll'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, X, AlertCircle, Wrench, CheckCircle2 } from 'lucide-react'
import { projects } from '../data/projects'
import { profile } from '../data/profile'
import { projectGallery, projectImage } from '../lib/projectImages'
import { GithubIcon } from '../components/BrandIcons'
import StatusBadge from '../components/StatusBadge'
import ArchitectureDiagram from '../components/ArchitectureDiagram'
import AskProject from '../components/AskProject'
import { architecture, architectureText } from '../data/architecture'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.15 } }

const hasText = (value) => typeof value === 'string' && value.trim().length > 0

function Lightbox({ images, index, onClose, onChange, title }) {
  const closeRef = useRef(null)
  const many = images.length > 1
  const step = (dir) => onChange((index + dir + images.length) % images.length)

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = previousOverflow
      previousFocus?.focus?.({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (many && e.key === 'ArrowRight') onChange((index + 1) % images.length)
      else if (many && e.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [index, images.length, many, onChange, onClose])

  const navButton = 'absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25'

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} screenshot ${index + 1} of ${images.length}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 sm:p-10"
    >
      <img
        src={images[index]}
        alt={`${title} screenshot ${index + 1}`}
        className="max-h-full max-w-full rounded-card object-contain shadow-2xl"
      />
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25"
      >
        <X size={20} />
      </button>
      {many && (
        <>
          <button type="button" onClick={() => step(-1)} aria-label="Previous image" className={`${navButton} left-3 sm:left-5`}>
            <ChevronLeft size={22} />
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next image" className={`${navButton} right-3 sm:right-5`}>
            <ChevronRight size={22} />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[12px] font-bold tracking-[1px] text-white/70">
            {index + 1} / {images.length}
          </p>
        </>
      )}
    </motion.div>
  )
}

const SLIDE_MS = 4000

// Top image frame: every project image stacked in one fixed-size frame, cross-fading every 4s.
// Pauses on hover and while the tab is hidden; no auto-play with reduced motion (dots still work).
// Clicking the image opens the lightbox at that image.
function Slideshow({ images, title, onOpen }) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [tabHidden, setTabHidden] = useState(() => document.hidden)
  const many = images.length > 1

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // Restarts on every change of slide, so a dot click gets a full 4s too
  useEffect(() => {
    if (!many || reduced || hovered || tabHidden) return
    const timer = setTimeout(() => setActive((i) => (i + 1) % images.length), SLIDE_MS)
    return () => clearTimeout(timer)
  }, [active, many, reduced, hovered, tabHidden, images.length])

  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden rounded-[0.6rem]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        type="button"
        onClick={() => onOpen(active)}
        aria-label={`Open ${title} screenshot ${active + 1} of ${images.length}`}
        className="absolute inset-0 block h-full w-full cursor-zoom-in"
      >
        {images.map((src, i) => {
          const isActive = i === active
          return (
            <motion.img
              key={src}
              src={src}
              alt={isActive ? `${title} screenshot` : ''}
              initial={false}
              animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.02 }}
              // Leaving image: fade only, then reset its scale out of sight so it enters at 1.02 next time
              transition={
                reduced
                  ? { duration: 0 }
                  : isActive
                    ? { duration: 0.8, ease: 'easeOut' }
                    : { opacity: { duration: 0.8, ease: 'easeOut' }, scale: { duration: 0, delay: 0.8 } }
              }
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          )
        })}
      </button>

      {many && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show screenshot ${i + 1}`}
              aria-current={i === active}
              className="p-1"
            >
              <span
                className={`block h-1.5 w-1.5 rounded-full shadow-[0_0_2px_rgba(0,0,0,0.4)] transition-colors ${
                  i === active ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


// Problem → Solution → Result: three small cards, filled from project.summary
function SummaryStrip({ summary }) {
  const items = [
    { key: 'problem', label: 'Problem', Icon: AlertCircle },
    { key: 'solution', label: 'Solution', Icon: Wrench },
    { key: 'result', label: 'Result', Icon: CheckCircle2 },
  ].filter((i) => hasText(summary?.[i.key]))
  if (items.length === 0) return null
  return (
    <motion.ol
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      className="relative grid gap-3 md:grid-cols-3 md:gap-4"
    >
      {items.map(({ key, label, Icon }, i) => (
        <motion.li
          key={key}
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
          className="group relative rounded-2xl border border-border bg-paper p-5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink/20"
        >
          <span className="flex items-center gap-2">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full ${key === 'result' ? 'bg-accent text-white' : 'bg-surface text-ink'}`}>
              <Icon size={15} />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-muted">{label}</span>
          </span>
          <p className="mt-3 text-[14px] leading-relaxed text-secondary">{summary[key]}</p>
          {i < items.length - 1 && (
            <span aria-hidden="true" className="absolute -right-[13px] top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-paper text-accent md:flex">
              <ArrowRight size={12} />
            </span>
          )}
        </motion.li>
      ))}
    </motion.ol>
  )
}

function NotFound() {
  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-[1280px] flex-col justify-center overflow-hidden px-4 py-20 md:px-8">
      <span aria-hidden="true" className="watermark left-0 top-10">
        404
      </span>
      <div className="relative">
        <BackLink />
        <p className="eyebrow mt-10">Not found</p>
        <h1 className="section-title mt-4">Project not found</h1>
        <p className="mt-4 text-[15px]">This project doesn&apos;t exist.</p>
      </div>
    </main>
  )
}

// Home.jsx scrolls to the hash after navigating
function BackLink() {
  // Came from the home page this visit: go back to the exact spot. Opened directly: jump to Projects.
  const hasHomeScroll = peekHomeScroll() != null
  return (
    <Link
      to={hasHomeScroll ? '/' : '/#projects'}
      state={hasHomeScroll ? { restoreScroll: true } : undefined}
      className="inline-flex items-center gap-2 text-sm font-medium text-grey transition-colors hover:text-accent"
    >
      <ArrowLeft size={16} /> Back to projects
    </Link>
  )
}

export default function ProjectCaseStudy() {
  const { slug } = useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = projects[index]
  // Open lightbox image, tied to its project so it's closed automatically on "Next project"
  const [open, setOpen] = useState(null) // { slug, index } | null
  const lightbox = open?.slug === slug ? open.index : null
  const setLightbox = (i) => setOpen(i === null ? null : { slug, index: i })

  // New project: start at the top (instant, not the page's smooth scrolling)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  useEffect(() => {
    if (!project) return
    const previous = document.title
    document.title = `${project.title} · ${profile.name}`
    return () => {
      document.title = previous
    }
  }, [project])

  if (!project) return <NotFound />

  // Main image first, then <slug>-2, <slug>-3 …: the top slideshow and the lightbox
  const images = [projectImage(project), ...projectGallery(project)].filter(Boolean)
  const next = projects[(index + 1) % projects.length]
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const nextImage = projectImage(next)
  const overview = hasText(project.overview) ? project.overview : project.short
  const diagram = architecture[project.slug]
  const steps = Array.isArray(project.howItWorks) ? project.howItWorks.filter(hasText) : []

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
  const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }
  const hasDetails = hasText(project.problem) || steps.length > 0 || hasText(project.challenges) || hasText(project.results)

  return (
    <main className="overflow-x-clip">
      <div className="relative mx-auto max-w-[1120px] px-4 md:px-8">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-4 select-none text-[110px] font-extrabold leading-none text-ink/[0.035] md:text-[160px]"
        >
          {project.id}
        </span>

        {/* Top: details left, image slideshow right */}
        <section className="relative grid items-center gap-8 pb-12 pt-10 md:pt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={item}><BackLink /></motion.div>
            <motion.p variants={item} className="eyebrow mt-8">Case study · {project.id}</motion.p>
            <motion.h1 variants={item} className="mt-3 text-[30px] font-bold leading-[1.1] tracking-tightest text-ink-heading md:text-[40px]">
              {project.title}
            </motion.h1>
            {hasText(project.short) && (
              <motion.p variants={item} className="mt-4 max-w-md text-[15px] leading-relaxed text-secondary">
                {project.short}
              </motion.p>
            )}
            <motion.div variants={item} className="mt-5 flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status} />
              {project.category.map((c) => (
                <span key={c} className="rounded-full bg-surface px-3 py-1 text-[12px] font-medium text-ink">{c}</span>
              ))}
            </motion.div>
            <motion.div variants={item} className="mt-6 flex flex-wrap gap-2.5">
              {project.live && (
                <a href={project.live} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_24px_-10px_rgba(255,49,49,0.7)] transition-transform hover:-translate-y-0.5">
                  Live <ArrowUpRight size={15} />
                </a>
              )}
              <a href={project.github} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-dark px-5 py-2.5 text-[13px] font-bold text-white transition-transform hover:-translate-y-0.5">
                <GithubIcon size={15} /> GitHub <ArrowUpRight size={15} />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24, rotate: 0.6 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div aria-hidden="true" className="absolute -inset-4 -z-10 rounded-[28px] bg-[radial-gradient(60%_60%_at_70%_30%,rgba(255,49,49,0.12),transparent_70%)]" />
            <div className="overflow-hidden rounded-2xl border border-border bg-surface-soft p-2 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.25)]">
              {images.length > 0 ? (
                <Slideshow key={slug} images={images} title={project.title} onOpen={setLightbox} />
              ) : (
                <div className="flex aspect-[16/10] items-end rounded-[0.25rem] bg-[radial-gradient(circle_at_30%_20%,#3a3a3a,#111_70%)] p-6">
                  <span className="text-[64px] font-black leading-none text-white/10">{project.id}</span>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {project.summary && (
          <section className="border-t border-border py-10">
            <SummaryStrip summary={project.summary} />
          </section>
        )}

        {/* Body: text left, sticky info card right */}
        <section className="grid gap-10 border-t border-border py-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
          <div className="space-y-10">
            <motion.div variants={fadeUp} {...inView}>
              <h2 className="text-[20px] font-bold text-ink-heading">Overview</h2>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-secondary">
                {hasText(overview) ? overview : 'Details coming soon.'}
              </p>
            </motion.div>

            {hasText(project.problem) && (
              <motion.div variants={fadeUp} {...inView}>
                <h2 className="text-[20px] font-bold text-ink-heading">The problem</h2>
                <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-secondary">{project.problem}</p>
              </motion.div>
            )}

            {steps.length > 0 && (
              <motion.div variants={fadeUp} {...inView}>
                <h2 className="text-[20px] font-bold text-ink-heading">How it works</h2>
                <ol className="mt-4 space-y-3">
                  {steps.map((stepText, i) => (
                    <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-secondary">
                      <span className="mt-0.5 text-[13px] font-bold text-accent">{String(i + 1).padStart(2, '0')}</span>
                      <span>{stepText}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            )}

            {['challenges', 'results'].map((key) =>
              hasText(project[key]) ? (
                <motion.div key={key} variants={fadeUp} {...inView}>
                  <h2 className="text-[20px] font-bold text-ink-heading">{key === 'challenges' ? 'Challenges' : 'Results'}</h2>
                  <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-secondary">{project[key]}</p>
                </motion.div>
              ) : null,
            )}

            {!hasDetails && !diagram && !project.summary && (
              <p className="text-[14px] text-muted">A deeper write-up of this project is coming soon.</p>
            )}
          </div>

          <aside className="lg:sticky lg:top-[100px] lg:self-start">
            <AskProject project={project} />
          </aside>
        </section>

        {diagram && (
          <motion.section variants={fadeUp} {...inView} className="border-t border-border py-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Under the hood</p>
                <h2 className="mt-2 text-[20px] font-bold text-ink-heading md:text-[24px]">{architectureText.title}</h2>
              </div>
            </div>
            <div className="mt-6">
              <ArchitectureDiagram key={project.slug} system={diagram} />
            </div>
          </motion.section>
        )}

        {/* Previous / next project + contact line */}
        <motion.div variants={fadeUp} {...inView} className="border-t border-border pb-16 pt-10">
          <p className="text-center text-[14px] text-muted">
            Building something similar?{' '}
            <Link to="/#contact" className="font-semibold text-accent transition-colors hover:text-ink">Get in touch ↗</Link>
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            images={images}
            index={lightbox}
            onChange={setLightbox}
            onClose={() => setLightbox(null)}
            title={project.title}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
