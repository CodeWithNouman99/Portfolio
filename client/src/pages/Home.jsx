import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { saveHomeScroll, peekHomeScroll } from '../lib/homeScroll'
import TechStack from '../sections/TechStack'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Projects from '../sections/Projects'
import Timeline from '../sections/Timeline'
import Services from '../sections/Services'
import Certifications from '../sections/Certifications'
import Contact from '../sections/Contact'
import { sections } from '../data/sections'

export default function Home() {
  const { hash, state } = useLocation()
  const navigationType = useNavigationType()

  // Remember the scroll position while on the home page (kept in memory when you open a project).
  // Layout effect: the listener is removed before the page is swapped, so the swap can't overwrite the value.
  useLayoutEffect(() => {
    const onScroll = () => saveHomeScroll(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Coming back from a project page ("Back to projects" or the browser back button): return to the same spot.
  // A fresh visit/refresh has nothing saved, so it starts at the top. Navbar section links carry a hash and win.
  useEffect(() => {
    const y = peekHomeScroll()
    if (y == null || hash) return
    if (!state?.restoreScroll && navigationType !== 'POP') return
    const timer = setTimeout(() => window.scrollTo({ top: y, behavior: 'instant' }), 0)
    return () => clearTimeout(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Arriving from another route with a hash (e.g. /#projects, /#contact): scroll once the sections exist.
  // After a tick and instant: a smooth scroll started while the new page mounts gets cancelled.
  useEffect(() => {
    if (!hash) return
    const timer = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' }), 0)
    return () => clearTimeout(timer)
  }, [hash])

  return (
    <main>
      <Hero />
      {/* Moving skill strips (components/SkillMarquee + TechMarquee) replaced by a still grouped stack */}
      <TechStack />
      <About />
      <Services />
      <Projects />
      {sections.showJourney && <Timeline />}
      {/* Build Logs (sections/BuildLogs.jsx, data/logs.js) is hidden for now; render <BuildLogs /> here to bring it back */}
      <Certifications />
      <Contact />
    </main>
  )
}
