import { Mail } from 'lucide-react'
import { footer } from '../data/contact'
import { profile } from '../data/profile'
import { GithubIcon, LinkedinIcon } from './BrandIcons'

const socials = [
  { label: 'LinkedIn', href: profile.links.linkedin, Icon: LinkedinIcon, external: true },
  { label: 'GitHub', href: profile.links.github, Icon: GithubIcon, external: true },
  { label: 'Email', href: `mailto:${profile.links.email}`, Icon: Mail },
]

// Availability pill with a softly pulsing green dot (still with reduced motion).
// On phones it wraps to two lines next to the dot (max width keeps it hugging them), with softer corners.
function Availability() {
  return (
    <p className="flex max-w-[250px] items-center gap-2.5 rounded-2xl border border-border px-4 py-2 text-left text-[13px] text-muted sm:max-w-full sm:rounded-full">
      <span aria-hidden="true" className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#22c55e] opacity-60 [animation-duration:2s] motion-reduce:hidden" />
        <span className="relative h-2 w-2 rounded-full bg-[#22c55e]" />
      </span>
      <span className="text-balance">{profile.availability}</span>
    </p>
  )
}

// Below 1280px: one centred column (socials, availability, portfolio line, copyright).
// xl+: one row: socials and copyright left, availability centred, portfolio line right.
// The left group is `contents` below xl, so its two children take part in the column's order.
export default function Footer() {
  return (
    <footer className="border-t border-border bg-paper">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-5 px-4 pb-24 pt-8 text-center md:px-8 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-8 xl:py-8 xl:text-left">
        <div className="contents xl:flex xl:items-center xl:gap-5">
          <div className="order-1 flex gap-2 xl:order-none">
            {socials.map(({ label, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                {...(external && { target: '_blank', rel: 'noreferrer' })}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-accent hover:text-accent"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
          <p className="order-4 text-[13px] text-muted xl:order-none xl:whitespace-nowrap">{footer.copyright}</p>
        </div>
        <div className="order-2 flex max-w-full justify-center xl:order-none">
          <Availability />
        </div>
        <p className="order-3 text-[13px] text-muted xl:order-none xl:whitespace-nowrap xl:text-right">{footer.center}</p>
      </div>
    </footer>
  )
}
