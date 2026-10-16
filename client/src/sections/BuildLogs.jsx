import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { logs } from '../data/logs'

// Cover photos at src/assets/logs/<id>.<ext> are used when `image` is not set in the data
const assetImages = Object.fromEntries(
  Object.entries(
    import.meta.glob('../assets/logs/*.{jpg,jpeg,png,webp}', {
      eager: true,
      import: 'default',
    }),
  ).map(([path, src]) => [path.split('/').pop().split('.')[0], src]),
)
const imageFor = (post) => post.image ?? assetImages[post.id] ?? null

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 } }

// Whole card is a link once the post has one; until then it renders as a plain article
function CardShell({ post, className, children }) {
  const shared = `group overflow-hidden rounded-card border border-border bg-white ${className}`
  return post.link ? (
    <motion.a variants={fadeUp} {...inView} href={post.link} target="_blank" rel="noreferrer" className={`block ${shared}`}>
      {children}
    </motion.a>
  ) : (
    <motion.article variants={fadeUp} {...inView} className={shared}>
      {children}
    </motion.article>
  )
}

function Cover({ post, className }) {
  const image = imageFor(post)
  return (
    <div className={`relative overflow-hidden bg-dark ${className}`}>
      {image ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out [filter:grayscale(100%)_contrast(1.1)] group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,#3a3a3a,#111_70%)] transition-transform duration-700 ease-out group-hover:scale-105" />
      )}
    </div>
  )
}

function Meta({ post }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-bold uppercase tracking-eyebrow text-accent">
        {post.category}
      </span>
      {post.date && <span className="text-[12px] text-grey">{post.date}</span>}
    </div>
  )
}

function SeeDetails() {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-accent">
      See Details
      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
    </span>
  )
}

function FeaturedCard({ post }) {
  return (
    <CardShell post={post} className="grid md:grid-cols-2">
      <Cover post={post} className="aspect-[16/10] md:aspect-auto md:min-h-[340px]" />
      <div className="flex flex-col justify-center gap-5 p-7 md:p-10">
        <Meta post={post} />
        <h3 className="text-[22px] font-bold leading-snug tracking-tight text-ink-heading transition-colors group-hover:text-accent md:text-[28px]">
          {post.title}
        </h3>
        <SeeDetails />
      </div>
    </CardShell>
  )
}

function PostCard({ post }) {
  return (
    <CardShell post={post} className="flex flex-col">
      <Cover post={post} className="aspect-[16/9]" />
      <div className="flex flex-1 flex-col gap-4 p-7">
        <Meta post={post} />
        <h3 className="text-[19px] font-bold leading-snug text-ink-heading transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <div className="mt-auto">
          <SeeDetails />
        </div>
      </div>
    </CardShell>
  )
}

export default function BuildLogs() {
  const [featured, ...rest] = logs.items

  return (
    <section id="logs" className="relative overflow-x-clip py-20 md:py-28">
      <div className="relative mx-auto max-w-[1280px] px-4 md:px-8">
        <span aria-hidden="true" className="watermark -top-4 left-0 md:-top-10">
          {logs.watermark}
        </span>

        <motion.div
          variants={fadeUp}
          {...inView}
          className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="eyebrow">{logs.eyebrow}</p>
            <h2 className="section-title mt-4">{logs.title}</h2>
          </div>
          <a
            href={logs.allLink.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[15px] text-muted transition-colors hover:text-accent"
          >
            {logs.allLink.label} <ArrowUpRight size={16} />
          </a>
        </motion.div>

        <div className="relative mt-12 flex flex-col gap-6">
          {featured && <FeaturedCard post={featured} />}
          {rest.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {rest.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
