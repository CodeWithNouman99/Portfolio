import { techStack } from '../data/skills'

const edgeFade = 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)'

// Each half holds the list twice so it always overflows wide screens
const items = [...techStack, ...techStack]

function TechList({ hidden = false }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-2 pr-2">
      {items.map((tech, i) => (
        <li
          key={i}
          className="whitespace-nowrap rounded-full border border-border bg-surface px-3.5 py-1.5 text-[12px] font-medium text-grey"
        >
          {tech}
        </li>
      ))}
    </ul>
  )
}

export default function TechMarquee() {
  return (
    <div className="border-b border-border bg-paper">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-4 pl-4 md:gap-6 md:pl-8">
        <p className="shrink-0 text-[11px] font-bold uppercase tracking-[1.5px] text-ink-heading">
          Tech I ship with
        </p>
        <div
          className="group min-w-0 flex-1 overflow-hidden"
          style={{ maskImage: edgeFade, WebkitMaskImage: edgeFade }}
        >
          <div className="flex w-max animate-marquee-reverse group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            <TechList />
            <TechList hidden />
          </div>
        </div>
      </div>
    </div>
  )
}
