import { motion } from 'framer-motion'
import { about } from '../data/about'

// Optional tile photos at src/assets/about/<block id>.<ext>
const tileImages = Object.fromEntries(
  Object.entries(
    import.meta.glob('../assets/about/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' }),
  ).map(([path, src]) => [path.split('/').pop().split('.')[0], src]),
)

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.3 } }

function ImageTile({ block, flipped }) {
  const src = tileImages[block.id]

  return (
    <motion.div
      variants={fadeUp}
      {...inView}
      className={`group relative flex min-h-[260px] items-end overflow-hidden rounded-card bg-neutral-800 lg:min-h-[320px] ${
        flipped ? 'lg:order-2' : ''
      }`}
    >
      {src && (
        <img
          src={src}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out [filter:grayscale(100%)_contrast(1.1)] group-hover:scale-105"
        />
      )}
      {/* Red duotone over the photo; softer wash on the dark fallback */}
      <div
        className={`absolute inset-0 ${
          src
            ? 'bg-[linear-gradient(to_top_right,rgba(255,49,49,0.65),transparent)]'
            : 'bg-[linear-gradient(to_top_right,rgba(255,49,49,0.6),transparent_70%)]'
        }`}
      />
      <h3 className="relative p-8 text-[40px] font-bold leading-[1.05] tracking-tight text-white md:p-10 md:text-[48px]">
        {block.heading[0]}
        <br />
        {block.heading[1]}
      </h3>
    </motion.div>
  )
}

function TextCard({ block }) {
  return (
    <motion.div
      variants={fadeUp}
      {...inView}
      className="flex items-center rounded-card border border-border bg-paper p-8 md:p-10 lg:min-h-[320px]"
    >
      <p className="text-[15px] leading-body">{block.body}</p>
    </motion.div>
  )
}

export default function About() {
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

        <div className="relative mt-12 space-y-6 md:mt-16">
          {about.blocks.map((block, i) => (
            <div key={block.id} className="grid gap-6 lg:grid-cols-2">
              <ImageTile block={block} flipped={i % 2 === 1} />
              <TextCard block={block} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
