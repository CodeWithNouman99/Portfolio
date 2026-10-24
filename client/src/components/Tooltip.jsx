import { useEffect, useRef, useState } from 'react'

// One tooltip for the whole site: hovering (or keyboard-focusing) any icon-only button or link shows its
// name in a small pill with an arrow. It reads `data-tip` or, if missing, `aria-label`, so every icon
// that already has an aria-label gets a tooltip without extra code. Add `data-no-tip` to opt out.
// Only on devices with a real mouse; touch screens have no hover.
const SELECTOR = 'a[aria-label], button[aria-label], [data-tip]'
const MAX_ICON_SIZE = 72 // px: larger elements (cards, images) are not "icons"

function tipFor(el) {
  if (!el || el.closest('[data-no-tip]')) return null
  if (el.dataset.tip) return el.dataset.tip
  const rect = el.getBoundingClientRect()
  const iconOnly = !el.innerText?.trim() && rect.width <= MAX_ICON_SIZE && rect.height <= MAX_ICON_SIZE
  return iconOnly ? el.getAttribute('aria-label') : null
}

export default function Tooltip() {
  const [tip, setTip] = useState(null) // { text, x, y, below }
  const [shown, setShown] = useState(false)
  const target = useRef(null)
  const timer = useRef(0)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const hide = () => {
      clearTimeout(timer.current)
      target.current = null
      setShown(false)
    }

    const show = (el) => {
      const text = tipFor(el)
      if (!text) return hide()
      if (target.current === el) return
      target.current = el
      clearTimeout(timer.current)
      const r = el.getBoundingClientRect()
      const below = r.top < 56
      setTip({ text, x: r.left + r.width / 2, y: below ? r.bottom + 10 : r.top - 10, below })
      timer.current = setTimeout(() => setShown(true), 120)
    }

    const onOver = (e) => {
      const el = e.target.closest?.(SELECTOR)
      if (el) show(el)
      else if (target.current) hide()
    }
    const onFocus = (e) => {
      const el = e.target.closest?.(SELECTOR)
      if (el && el.matches(':focus-visible')) show(el)
    }

    document.addEventListener('pointerover', onOver)
    document.addEventListener('focusin', onFocus)
    document.addEventListener('focusout', hide)
    document.addEventListener('pointerdown', hide)
    window.addEventListener('scroll', hide, { passive: true })
    return () => {
      clearTimeout(timer.current)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('focusin', onFocus)
      document.removeEventListener('focusout', hide)
      document.removeEventListener('pointerdown', hide)
      window.removeEventListener('scroll', hide)
    }
  }, [])

  if (!tip) return null

  // Keep the pill inside the screen horizontally
  const x = Math.min(Math.max(tip.x, 70), window.innerWidth - 70)

  return (
    <div
      role="tooltip"
      style={{ left: x, top: tip.y }}
      className={`pointer-events-none fixed z-[100] -translate-x-1/2 transition-[opacity,transform] duration-150 ease-out ${
        tip.below ? '' : '-translate-y-full'
      } ${shown ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#111] px-2.5 py-1.5 text-[12px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.35)] transition-transform duration-150 dark:bg-white dark:text-[#111] ${
          shown ? 'translate-y-0 scale-100' : `${tip.below ? '-translate-y-1' : 'translate-y-1'} scale-95`
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
        {tip.text}
        <span
          aria-hidden="true"
          className={`absolute left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#111] dark:bg-white ${
            tip.below ? '-top-1' : '-bottom-1'
          }`}
        />
      </div>
    </div>
  )
}
