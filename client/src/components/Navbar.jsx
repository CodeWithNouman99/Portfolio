import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { navItems } from '../data/navigation'
import { profile } from '../data/profile'
import useActiveSection from '../hooks/useActiveSection'
import { GithubIcon, LinkedinIcon } from './BrandIcons'

const sectionIds = navItems.map((item) => item.id)

const socials = [
  { label: 'LinkedIn', href: profile.links.linkedin, Icon: LinkedinIcon },
  { label: 'GitHub', href: profile.links.github, Icon: GithubIcon },
]

// On the home page, scroll in JS (html has no CSS smooth scrolling: it fights the scroll-linked Journey track).
// Elsewhere, navigate home in-app and Home.jsx jumps to the section (a full page load would start at the top).
function useSectionLink() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return (e, id) => {
    e.preventDefault()
    if (pathname !== '/') return navigate(`/#${id}`)
    window.history.pushState(null, '', `#${id}`)
    // Next tick: lets the mobile menu release its body scroll lock first
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 0)
  }
}

function Logo() {
  const goToSection = useSectionLink()
  return (
    <a href="/#home" onClick={(e) => goToSection(e, 'home')} className="text-2xl font-bold tracking-tight text-ink-heading">
      {profile.firstName.toLowerCase()}
      <span className="text-accent">.</span>
    </a>
  )
}

export default function Navbar() {
  const [active, setActive] = useActiveSection(sectionIds)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  const goToSection = useSectionLink()

  const handleNav = (e, id) => {
    goToSection(e, id)
    setActive(id)
    setMenuOpen(false)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b bg-paper/80 backdrop-blur-md transition-colors duration-300 ${
          scrolled ? 'border-border' : 'border-transparent'
        }`}
      >
        <nav className="relative mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-4 md:px-8">
          <Logo />

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full bg-surface p-1 md:flex">
            {navItems.map(({ label, id }) => {
              const isActive = active === id
              return (
                <li key={id} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-paper shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <a
                    href={`/#${id}`}
                    onClick={(e) => handleNav(e, id)}
                    className={`relative block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-accent' : 'text-ink hover:text-accent'
                    }`}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-1">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="hidden h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface hover:text-accent md:flex"
              >
                <Icon size={18} />
              </a>
            ))}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-surface md:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex h-[100dvh] flex-col bg-paper md:hidden"
          >
            <div className="flex h-[72px] items-center justify-between px-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-surface"
              >
                <X size={22} />
              </button>
            </div>

            <ul className="flex flex-1 flex-col justify-center gap-2 px-6">
              {navItems.map(({ label, id }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                >
                  <a
                    href={`/#${id}`}
                    onClick={(e) => handleNav(e, id)}
                    className={`block py-2 text-4xl font-bold tracking-tight ${
                      active === id ? 'text-accent' : 'text-ink-heading'
                    }`}
                  >
                    {label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="flex gap-3 border-t border-border px-6 py-6">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink hover:border-accent hover:text-accent"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
