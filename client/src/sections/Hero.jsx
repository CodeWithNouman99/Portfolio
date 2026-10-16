import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Download, Mail } from 'lucide-react'
import { profile } from '../data/profile'
import useFileExists from '../hooks/useFileExists'
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons'
import WaveTexture from '../components/WaveTexture'

// Resolves to the photo if src/assets/hero.png exists, otherwise undefined.
const heroPhoto = Object.values(
  import.meta.glob('../assets/hero.png', { eager: true, import: 'default' }),
)[0]

const { hero, links } = profile

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const socials = [
  { label: 'Email', href: `mailto:${links.email}`, Icon: Mail },
  { label: 'LinkedIn', href: links.linkedin, Icon: LinkedinIcon },
  { label: 'GitHub', href: links.github, Icon: GithubIcon },
]

// Tags sit on the arch's side edges, upper and lower on each side, kept out of the photo's central
// band (where the face is). How far they hang outside depends on the room around the photo:
//   mobile: 44px outside (viewport margin)   sm–md: fully outside, overlapping the edge by 16px
//   lg+:    28px outside (the intro text and stats card sit ~40px from the photo)
// Set on a static wrapper, because Framer's float animation overwrites the inner tag's transform.
const LEFT =
  'left-0 -translate-x-11 sm:left-auto sm:right-full sm:translate-x-4 lg:left-0 lg:right-auto lg:-translate-x-7'
const RIGHT =
  'right-0 translate-x-11 sm:right-auto sm:left-full sm:-translate-x-4 lg:right-0 lg:left-auto lg:translate-x-7'
// Index = position in profile.hero.floatingTags: two upper slots at face height, two lower beside the body.
const tagPlacement = [
  { className: `${LEFT} top-[68%]`, delay: 0 }, // React: left, lower
  { className: `${RIGHT} top-[34%]`, delay: 1.1 }, // Node.js: right, upper
  { className: `${LEFT} top-[28%]`, delay: 0.6 }, // n8n: left, upper
  { className: `${RIGHT} top-[76%]`, delay: 1.7 }, // Gemini: right, lower
]

function scrollToContact(e) {
  e.preventDefault()
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}

function SilhouettePlaceholder() {
  return (
    <svg
      viewBox="0 0 200 260"
      className="h-[92%] w-auto text-neutral-300"
      fill="currentColor"
      aria-label="Photo placeholder"
      role="img"
    >
      <circle cx="100" cy="70" r="44" />
      <path d="M100 124c-52 0-88 34-92 88l-2 48h188l-2-48c-4-54-40-88-92-88z" />
    </svg>
  )
}

// "View CV" + "Download CV". Always visible; while client/public/cv.pdf is missing, a click shows a small
// toast with the email instead of opening a broken link. Adding the file is enough, no code change.
function CvButtons() {
  // One HEAD request on load; must be served as a PDF (missing files fall back to index.html)
  const cvAvailable = useFileExists(profile.cvUrl, 'pdf')
  const [toast, setToast] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const guard = (e) => {
    if (cvAvailable) return
    e.preventDefault()
    setToast(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(false), 5000)
  }

  return (
    <div className="relative flex items-center gap-3">
      <a
        href={profile.cvUrl}
        target="_blank"
        rel="noreferrer"
        onClick={guard}
        className="group inline-flex items-center gap-1.5 text-sm font-bold text-ink-heading"
      >
        <span className="border-b border-transparent transition-colors group-hover:border-ink-heading">
          {profile.cv.view}
        </span>
        <ArrowUpRight size={16} />
      </a>
      <a
        href={profile.cvUrl}
        download={profile.cv.fileName}
        onClick={guard}
        aria-label={profile.cv.download}
        title={profile.cv.download}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-accent hover:text-accent"
      >
        <Download size={16} />
      </a>

      <div aria-live="polite" className="absolute left-0 top-full z-20 mt-3">
        <AnimatePresence>
          {toast && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="w-max max-w-[min(300px,calc(100vw-2rem))] rounded-card bg-dark px-3.5 py-2.5 text-[12px] leading-relaxed text-white shadow-lg"
            >
              {profile.cv.missing}{' '}
              <a href={`mailto:${links.email}`} className="font-semibold text-white underline underline-offset-2">
                {links.email}
              </a>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function IntroColumn() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="relative z-10">
      <motion.p variants={fadeUp} className="kicker">
        {hero.kicker}
      </motion.p>

      <motion.h1
        variants={fadeUp}
        className="mt-4 text-[48px] font-extrabold leading-name tracking-tightest sm:text-[64px] lg:text-[72px] xl:text-[88px]"
      >
        {profile.firstName}
        <br />
        {profile.lastName}
      </motion.h1>

      <motion.p variants={fadeUp} className="mt-6 max-w-md text-[15px]">
        {hero.intro}
      </motion.p>

      <motion.ul variants={fadeUp} className="mt-6 space-y-2.5">
        {hero.bullets.map((item) => (
          <li key={item} className="flex items-center gap-3 text-sm font-medium text-ink">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </motion.ul>

      <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-6">
        <a
          href="#contact"
          onClick={scrollToContact}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(255,49,49,0.6)] transition-transform hover:-translate-y-0.5"
        >
          Get In Touch <ArrowUpRight size={16} />
        </a>
        <CvButtons />
      </motion.div>

      <motion.div variants={fadeUp} className="mt-8 flex items-center gap-4">
        <span className="text-sm font-medium text-grey">Find me on:</span>
        <div className="flex gap-2">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-accent hover:bg-accent hover:text-white"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function PhotoColumn() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
      className="relative z-10 mx-auto w-[260px] sm:w-[320px] xl:w-[360px]"
    >
      <div className="relative aspect-[3/4]">
        {/* Red arch */}
        <div className="absolute inset-x-0 bottom-0 top-[8%] rounded-t-full bg-accent" />

        {/* Photo / placeholder */}
        <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-center overflow-hidden rounded-b-none">
          {heroPhoto ? (
            <img
              src={heroPhoto}
              alt={profile.name}
              className="h-full w-auto object-contain object-bottom grayscale-0"
            />
          ) : (
            <SilhouettePlaceholder />
          )}
        </div>

        {/* Floating tags */}
        {hero.floatingTags.map((tag, i) => (
          <span key={tag} className={`absolute z-10 ${tagPlacement[i].className}`}>
            <motion.span
              // Compact on mobile and lg+, where the tags partly overlap the arch
              className="block whitespace-nowrap rounded-full bg-dark px-2.5 py-2 text-[10px] font-bold tracking-[0.5px] text-white shadow-lg sm:px-3.5 sm:text-[11px] sm:tracking-[1px] lg:px-2.5 lg:text-[10px] lg:tracking-[0.5px]"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: tagPlacement[i].delay,
              }}
            >
              {tag}
            </motion.span>
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// "5+" counts 0+ → 5+, "3.52" counts 0.00 → 3.52; once, when it first scrolls into view.
// Screen readers get the final value only; reduced motion shows it straight away.
function CountUp({ value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = useReducedMotion()
  const [, number = '', suffix = value] = String(value).match(/^(\d+(?:\.\d+)?)(.*)$/) ?? []
  const decimals = number.split('.')[1]?.length ?? 0
  const [display, setDisplay] = useState(() => `${(0).toFixed(decimals)}${suffix}`)

  useEffect(() => {
    if (!number || !inView || reduced) return
    const controls = animate(0, Number(number), {
      duration: 1.4,
      delay: 0.3, // let the card's own fade-in start first
      ease: 'easeOut',
      onUpdate: (n) => setDisplay(`${n.toFixed(decimals)}${suffix}`),
      onComplete: () => setDisplay(value),
    })
    return () => controls.stop()
  }, [inView, reduced, number, decimals, suffix, value])

  return (
    <span ref={ref}>
      <span aria-hidden="true" className="tabular-nums">
        {reduced || !number ? value : display}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  )
}

function StatsColumn() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-10 mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto"
    >
      <motion.div
        variants={fadeUp}
        className="rounded-card border border-border bg-paper p-6 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.12)]"
      >
        <p className="eyebrow">Impact</p>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {profile.stats.map((stat, i) => (
            <div key={i}>
              <p className="text-[28px] font-black leading-none text-ink-heading">
                <CountUp value={stat.value} />
              </p>
              {/* Labels are already uppercase in profile.js, except "n8n", which must stay lowercase */}
              <p className="mt-2 text-stat-label tracking-stat text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
          <p className="text-[13px] leading-snug text-muted">{hero.statsNote}</p>
          <a
            href="#contact"
            onClick={scrollToContact}
            className="flex h-[76px] w-[76px] shrink-0 flex-col items-center justify-center gap-1 rounded-full bg-dark text-center text-[10px] font-bold uppercase leading-tight tracking-[1px] text-white transition-colors hover:bg-accent"
          >
            Let&apos;s talk
            <ArrowRight size={14} />
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden lg:flex lg:min-h-[calc(100vh-72px)] lg:items-center"
    >
      {/* Sits behind the name: content is vertically centred on lg, so offset from the middle */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-2 select-none whitespace-nowrap text-center text-[clamp(140px,22vw,320px)] font-bold uppercase leading-none tracking-[-0.02em] text-ink/5 lg:top-[max(0px,calc(50%-340px))]"
      >
        {profile.firstName}
      </span>

      <WaveTexture className="h-48 md:h-64" />

      <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-14 px-4 pb-20 pt-10 md:px-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-10 lg:py-16">
        <IntroColumn />
        <PhotoColumn />
        <StatsColumn />
      </div>
    </section>
  )
}
