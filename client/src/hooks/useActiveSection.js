import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Returns the id of the section currently crossing the middle of the viewport.
// Every section[id] is watched, so sections outside `ids` (About, Journey) clear the highlight
// instead of leaving the previous nav item lit.
export default function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  const { pathname } = useLocation()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -55% 0px' },
    )

    // Re-observe on route change: returning from a case study mounts fresh section nodes
    document.querySelectorAll('section[id]').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [ids, pathname])

  return [active, setActive]
}
