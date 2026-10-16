import { skillMarquee } from '../data/skills'

// Each half holds the list twice so it always overflows wide screens
const items = [...skillMarquee, ...skillMarquee]

function SkillList({ hidden = false }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((skill, i) => (
        <li
          key={i}
          className="flex items-center whitespace-nowrap text-[12px] font-bold uppercase tracking-marquee text-white"
        >
          {skill}
          <span className="mx-6 text-[10px] text-accent">▸</span>
        </li>
      ))}
    </ul>
  )
}

export default function SkillMarquee() {
  return (
    <div className="group flex h-11 items-center overflow-hidden bg-dark">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        <SkillList />
        <SkillList hidden />
      </div>
    </div>
  )
}
