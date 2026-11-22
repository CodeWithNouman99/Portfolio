import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { about } from '../data/about'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.3 } }

// One phrase at a time, sliding up. Every phrase also sits invisibly in the same grid cell, so the line
// keeps the height of the longest one and nothing below it jumps. Turns only while on screen;
// with reduced motion it stays on the first phrase.
function RotatingPhrase({ phrases, intervalMs }) {
  const ref = useRef(null)
  const visible = useInView(ref)
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduced || !visible || phrases.length < 2) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % phrases.length), intervalMs)
    return () => clearInterval(timer)
  }, [reduced, visible, phrases.length, intervalMs])

  return (
    <span ref={ref} className="grid overflow-hidden text-accent">
      {phrases.map((phrase) => (
        <span key={phrase} className="invisible [grid-area:1/1]">
          {phrase}
        </span>
      ))}
      <AnimatePresence initial={false}>
        <motion.span
          key={index}
          className="[grid-area:1/1]"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function About() {
  const { statement, principles } = about

  return (
    <section id="about" className="relative overflow-hidden py-20 md:py-28">
      <div className="relative mx-auto max-w-[1280px] px-4 md:px-8">
        <span aria-hidden="true" className="watermark -top-4 left-0 md:-top-10">
          {about.watermark}
        </span>

        <motion.div
          variants={fadeUp}
          {...inView}
          className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="eyebrow">{about.eyebrow}</p>
            <h2 className="section-title mt-4">{about.title}</h2>
          </div>
          <p className="max-w-sm text-[15px] text-muted md:text-right">{about.intro}</p>
        </motion.div>

        <motion.div variants={fadeUp} {...inView} className="relative mt-12 md:mt-16">
          <h3 className="text-[34px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[44px] lg:text-[60px]">
            {/* Screen readers get the whole statement once instead of a line that keeps changing */}
            <span className="sr-only">
              {statement.lead} {statement.phrases.join(' ')}
            </span>
            <span aria-hidden="true">
              <span className="block text-muted">{statement.lead}</span>
              <RotatingPhrase phrases={statement.phrases} intervalMs={statement.intervalMs} />
            </span>
          </h3>
        </motion.div>

        <motion.ol
          variants={fadeUp}
          {...inView}
          className="relative mt-12 grid gap-8 border-t border-border pt-10 md:mt-16 md:grid-cols-3 md:gap-10"
        >
          {principles.map((text, i) => (
            <li key={text}>
              <span className="font-mono text-[12px] font-bold text-accent">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-3 text-[17px] font-semibold leading-snug text-ink-heading md:text-[18px]">{text}</p>
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
