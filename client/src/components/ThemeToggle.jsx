import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'

// Small round sun/moon button that floats just above the chat avatar (bottom-right). Adds/removes the "dark" class on <html> and remembers
// the choice in localStorage (index.html applies it before the page paints, so no flash).
function readTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(readTheme)
  const isDark = theme === 'dark'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#0C0C0C' : '#FFFFFF')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // storage blocked (private mode): the theme still works for this visit
    }
  }, [theme, isDark])

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Light theme' : 'Dark theme'}
      className={`flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-border bg-paper text-ink shadow-[0_6px_20px_rgba(0,0,0,0.1)] transition-[color,transform] hover:scale-105 hover:text-accent ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
