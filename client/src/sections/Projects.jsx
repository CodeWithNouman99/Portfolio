import { forwardRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react'
import { githubRepos, projectFilters, projects } from '../data/projects'
import { GithubIcon } from '../components/BrandIcons'
import StatusBadge from '../components/StatusBadge'
import { projectImage } from '../lib/projectImages'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 } }

function IconButton({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      onClick={(e) => e.stopPropagation()}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-paper text-ink transition-colors hover:border-dark hover:bg-dark hover:text-white"
    >
      {children}
    </a>
  )
}

// forwardRef: AnimatePresence mode="popLayout" measures each row through a ref
const ProjectRow = forwardRef(function ProjectRow({ project, onHover, highlighted }, ref) {
  const navigate = useNavigate()
  // Every project has a detail page
  const open = () => navigate(`/projects/${project.slug}`)

  return (
    <motion.li
      ref={ref}
      id={`project-${project.id}`}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => onHover(project)}
      onFocus={() => onHover(project)}
      onClick={open}
      className={`group flex cursor-pointer scroll-mt-28 gap-4 border-b border-border px-2 py-5 transition-colors duration-500 sm:gap-6 sm:px-4 ${
        highlighted ? 'bg-accent/[0.06]' : 'hover:bg-surface-soft'
      }`}
    >
      <span className="w-8 shrink-0 pt-0.5 text-[12px] font-bold text-accent">{project.id}</span>

      <div className="min-w-0 flex-1">
        <h3 className="flex items-center gap-2 text-[17px] font-bold leading-snug text-ink transition-colors group-hover:text-accent">
          <Link to={`/projects/${project.slug}`} onClick={(e) => e.stopPropagation()}>
            {project.title}
          </Link>
          <ArrowRight
            size={16}
            className="shrink-0 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          />
        </h3>
        {project.short && (
          <p className="mt-1 text-[13px] leading-relaxed text-muted">{project.short}</p>
        )}

        {project.tech.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <li
                key={t}
                className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-medium text-grey"
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        {/* Mobile: badge + links under the title */}
        <div className="mt-3 flex items-center gap-2 md:hidden">
          <StatusBadge status={project.status} />
          <RowLinks project={project} />
        </div>
      </div>

      <div className="hidden shrink-0 items-start gap-2 md:flex">
        <StatusBadge status={project.status} />
        <RowLinks project={project} />
      </div>
    </motion.li>
  )
})

function RowLinks({ project }) {
  return (
    <>
      <IconButton href={project.github} label={`${project.title} on GitHub`}>
        <GithubIcon size={14} />
      </IconButton>
      {project.live && (
        <IconButton href={project.live} label={`${project.title} live demo`}>
          <ExternalLink size={14} />
        </IconButton>
      )}
    </>
  )
}

function ShowcaseCard({ project }) {
  const image = project ? projectImage(project) : null

  return (
    <div className="sticky top-[100px] overflow-hidden rounded-card bg-dark">
      <div className="relative aspect-[4/3]">
        <AnimatePresence initial={false}>
          <motion.div
            key={project?.id ?? 'none'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            {image ? (
              <img
                src={image}
                alt={project.title}
                className="h-full w-full object-cover [filter:grayscale(100%)_contrast(1.1)]"
              />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,#3a3a3a,#111_70%)]" />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
        {project && (
          <span className="absolute left-5 top-5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
            {project.id} · {project.title}
          </span>
        )}
      </div>

      <div className="p-7 pt-2">
        <p className="eyebrow">Built &amp; Shipped</p>
        <p className="mt-3 text-[64px] font-bold leading-none tracking-tight text-white">
          {projects.length}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Full-stack apps and AI automation workflows, all on GitHub.
        </p>
      </div>
    </div>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [hovered, setHovered] = useState(projects[0])
  const [highlighted, setHighlighted] = useState(null)

  // lib/focusProject.js (chat project cards, agents demo): show every project, scroll to the row, flash it
  useEffect(() => {
    let timers = []
    const onFocus = (e) => {
      const project = projects.find((p) => p.id === e.detail)
      if (!project) return
      timers.forEach(clearTimeout)
      setFilter('All')
      setHovered(project)
      setHighlighted(project.id)
      timers = [
        setTimeout(() => {
          document.getElementById(`project-${project.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 50),
        setTimeout(() => setHighlighted(null), 2400),
      ]
    }
    window.addEventListener('project:focus', onFocus)
    return () => {
      window.removeEventListener('project:focus', onFocus)
      timers.forEach(clearTimeout)
    }
  }, [])

  const visible = filter === 'All' ? projects : projects.filter((p) => p.category.includes(filter))

  return (
    <section id="projects" className="relative overflow-x-clip py-20 md:py-28">
      <div className="relative mx-auto max-w-[1280px] px-4 md:px-8">
        <span aria-hidden="true" className="watermark -top-4 left-0 md:-top-10">
          Work
        </span>

        <motion.div
          variants={fadeUp}
          {...inView}
          className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="eyebrow">Work</p>
            <h2 className="section-title mt-4">Selected Projects</h2>
          </div>
          <a
            href={githubRepos}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[15px] text-muted transition-colors hover:text-accent"
          >
            View all on GitHub <ArrowUpRight size={16} />
          </a>
        </motion.div>

        <motion.div variants={fadeUp} {...inView} className="relative mt-10 flex flex-wrap gap-2">
          {projectFilters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === f ? 'bg-dark text-white' : 'bg-surface text-ink hover:bg-border'
              }`}
            >
              {f}
            </button>
          ))}
        </motion.div>

        <div className="relative mt-8 grid gap-10 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
          <motion.div variants={fadeUp} {...inView}>
            <motion.ul layout className="border-t border-border">
              <AnimatePresence mode="popLayout" initial={false}>
                {visible.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    onHover={setHovered}
                    highlighted={highlighted === project.id}
                  />
                ))}
              </AnimatePresence>
            </motion.ul>
          </motion.div>

          <motion.aside variants={fadeUp} {...inView} className="hidden lg:block">
            <ShowcaseCard project={hovered} />
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
