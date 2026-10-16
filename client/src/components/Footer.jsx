import { Mail } from 'lucide-react'
import { footer } from '../data/contact'
import { profile } from '../data/profile'
import { GithubIcon, LinkedinIcon } from './BrandIcons'

const socials = [
  { label: 'LinkedIn', href: profile.links.linkedin, Icon: LinkedinIcon, external: true },
  { label: 'GitHub', href: profile.links.github, Icon: GithubIcon, external: true },
  { label: 'Email', href: `mailto:${profile.links.email}`, Icon: Mail },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-paper">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-5 px-4 pb-24 pt-8 text-center md:py-8 md:grid md:grid-cols-3 md:px-8 md:text-left">
        <div className="flex gap-2">
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
        <p className="text-[13px] text-muted md:text-center">{footer.center}</p>
        <p className="text-[13px] text-muted md:text-right">{footer.copyright}</p>
      </div>
    </footer>
  )
}
