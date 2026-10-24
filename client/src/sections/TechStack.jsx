import { motion } from 'framer-motion'
import { Monitor, Server, Sparkles, Wrench } from 'lucide-react'
import { techStackSection } from '../data/skills'

const icons = { Monitor, Server, Sparkles, Wrench }

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 } }

// Still (no animation loop) grouped tech stack under the hero: 4 boxes, the speciality softly tinted red.
export default function TechStack() {
  const { eyebrow, title, intro, groups } = techStackSection

  return (
    <section id="stack" className="relative py-14 md:py-20">
      <div className="mx-auto max-w-[1280px] px-4 md:px-8">
        <motion.div variants={fadeUp} {...inView} className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-3 text-[28px] font-bold leading-tight md:text-[34px]">{title}</h2>
          </div>
          <p className="max-w-[340px] text-[14px] md:text-right">{intro}</p>
        </motion.div>

        <motion.ul
          variants={fadeUp}
          {...inView}
          className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4"
        >
          {groups.map((group) => {
            const Icon = icons[group.icon] ?? Sparkles
            return (
              <li
                key={group.title}
                className={`p-5 md:p-6 ${group.highlight ? 'bg-[#FFF6F6] dark:bg-[#1a1010]' : 'bg-paper'}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-white ${
                      group.highlight ? 'bg-accent' : 'bg-dark'
                    }`}
                  >
                    <Icon size={17} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold leading-tight text-ink-heading">{group.title}</span>
                    <span className="block text-[11px] font-medium text-muted">{group.note}</span>
                  </span>
                </div>

                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className={`rounded-full px-3 py-1 text-[12px] font-medium text-ink ${
                        group.highlight ? 'border border-accent/20 bg-paper' : 'bg-surface'
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
