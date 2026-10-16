import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { certifications } from '../data/certifications'

const { items, card } = certifications

// `image` is a path under src/assets/; the glob keeps missing files from breaking the build
const assetImages = Object.fromEntries(
  Object.entries(
    import.meta.glob('../assets/certifications/*.{jpg,jpeg,png,webp}', {
      eager: true,
      import: 'default',
    }),
  ).map(([path, src]) => [path.replace('../assets/', ''), src]),
)
const imageFor = (cert) => (cert?.image && assetImages[cert.image]) || null

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 } }

function CertRow({ cert, onPreview, onOpen }) {
  const image = imageFor(cert)
  const meta = [cert.issuer, cert.type, cert.note].filter(Boolean).join(' · ')

  return (
    <li
      onMouseEnter={() => onPreview(cert.id)}
      className="group flex items-start gap-4 border-b border-border px-2 py-6 transition-colors hover:bg-surface-soft sm:gap-6 sm:px-4"
    >
      <button
        type="button"
        onClick={() => image && onOpen(cert.id)}
        onFocus={() => onPreview(cert.id)}
        disabled={!image}
        aria-label={image ? `View ${cert.title} certificate` : undefined}
        className="flex min-w-0 flex-1 items-start gap-4 text-left disabled:cursor-default sm:gap-6"
      >
        <span className="w-8 shrink-0 pt-1 text-[12px] font-bold text-accent">{cert.id}</span>

        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-bold leading-snug text-ink transition-colors group-hover:text-accent">
            {cert.title}
          </span>
          <span className="mt-1 block text-[13px] leading-relaxed text-muted">{meta}</span>
          {cert.skills?.length > 0 && (
            <span className="mt-3 flex flex-wrap gap-2">
              {cert.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-surface px-3 py-1 text-[11px] font-bold text-grey">
                  {skill}
                </span>
              ))}
            </span>
          )}
        </span>

        {cert.date && <span className="shrink-0 pt-0.5 text-[13px] font-bold text-grey">{cert.date}</span>}
      </button>

      {cert.verifyUrl && (
        <a
          href={cert.verifyUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Verify ${cert.title}`}
          className="inline-flex shrink-0 items-center gap-1 pt-0.5 text-[13px] font-bold text-ink transition-colors hover:text-accent"
        >
          Verify <ArrowUpRight size={14} />
        </a>
      )}
    </li>
  )
}

function PreviewCard({ cert, onOpen }) {
  const image = imageFor(cert)

  return (
    <div className="sticky top-28 rounded-card bg-dark p-7 md:p-8">
      <p className="eyebrow">{card.eyebrow}</p>
      <p className="mt-4 text-[64px] font-bold leading-none tracking-tight text-white md:text-[80px]">
        {String(items.length).padStart(2, '0')}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-white/60">{card.note}</p>

      <button
        type="button"
        onClick={() => image && onOpen(cert.id)}
        disabled={!image}
        aria-label={image ? `Enlarge ${cert.title} certificate` : undefined}
        className="relative mt-6 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-card bg-white/5 p-3 disabled:cursor-default"
      >
        <AnimatePresence mode="wait">
          {image && (
            <motion.img
              key={cert.id}
              src={image}
              alt={`${cert.title} certificate`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="max-h-full max-w-full rounded-[0.25rem] object-contain shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)]"
            />
          )}
        </AnimatePresence>
      </button>
      {image && <p className="mt-3 text-[11px] leading-relaxed text-white/40">{card.hint}</p>}
    </div>
  )
}

function Lightbox({ cert, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus?.({ preventScroll: true })
    }
  }, [onClose])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} certificate`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 sm:p-10"
    >
      <img
        src={imageFor(cert)}
        alt={`${cert.title} certificate`}
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
    </motion.div>
  )
}

export default function Certifications() {
  const [previewId, setPreviewId] = useState(items[0]?.id)
  const [openId, setOpenId] = useState(null)
  const preview = items.find((c) => c.id === previewId)
  const open = items.find((c) => c.id === openId)
  const close = useRef(() => setOpenId(null)).current

  return (
    <section id="certifications" className="relative overflow-x-clip py-20 md:py-28">
      <div className="relative mx-auto max-w-[1280px] px-4 md:px-8">
        <span aria-hidden="true" className="watermark -top-4 left-0 md:-top-10">
          {certifications.watermark}
        </span>

        <motion.div variants={fadeUp} {...inView} className="relative">
          <p className="eyebrow">{certifications.eyebrow}</p>
          <h2 className="section-title mt-4">{certifications.title}</h2>
        </motion.div>

        <div className="relative mt-12 grid gap-10 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
          <motion.ul variants={fadeUp} {...inView} className="self-start border-t border-border">
            {items.map((cert) => (
              <CertRow key={cert.id} cert={cert} onPreview={setPreviewId} onOpen={setOpenId} />
            ))}
          </motion.ul>

          <motion.aside variants={fadeUp} {...inView} className="hidden lg:block">
            <PreviewCard cert={preview} onOpen={setOpenId} />
          </motion.aside>
        </div>
      </div>

      <AnimatePresence>{open && <Lightbox cert={open} onClose={close} />}</AnimatePresence>
    </section>
  )
}
