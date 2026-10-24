import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Mic, Volume2, VolumeX, X } from 'lucide-react'
import { chat } from '../data/chat'
import { projects } from '../data/projects'
import { sendChat } from '../lib/api'
import { focusProject } from '../lib/focusProject'
import { useSpeechInput, useSpeechOutput } from '../hooks/useSpeech'
import ThemeToggle from './ThemeToggle'

// Resolves to the avatar if src/assets/avatar.png exists, otherwise undefined.
const avatar = Object.values(
  import.meta.glob('../assets/avatar.png', { eager: true, import: 'default' }),
)[0]

function Avatar() {
  return avatar ? (
    <img src={avatar} alt="" className="h-full w-full rounded-full object-cover" />
  ) : (
    <span className="text-xl font-bold text-white">N</span>
  )
}

// Bot replies may contain light markdown. Render **bold** and line breaks as React elements;
// strip the rest (stray *, list markers) so raw symbols never show.
function formatInline(line) {
  // split with a capture group: odd indexes are the bold parts
  return line.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-bold text-ink-heading">
        {part}
      </strong>
    ) : (
      part.replace(/\*+/g, '')
    ),
  )
}

function FormattedText({ text }) {
  const lines = text
    .trim()
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((line) => line.replace(/^\s*[*-]\s+/, '• '))

  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {formatInline(line)}
    </Fragment>
  ))
}

// Small cards under a bot reply for the projects it talks about
function ProjectCards({ ids, onOpen }) {
  const cards = ids.map((id) => projects.find((p) => p.id === id)).filter(Boolean)
  if (!cards.length) return null
  return (
    <ul className="mt-2 max-w-[85%] space-y-1.5">
      {cards.map((p) => (
        <li key={p.id}>
          <button
            type="button"
            onClick={() => onOpen(p.id)}
            className="group flex w-full items-center gap-3 rounded-xl border border-border bg-paper px-3 py-2 text-left transition-colors hover:border-dark"
          >
            <span className="shrink-0 text-[11px] font-bold text-accent">{p.id}</span>
            <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-ink-heading">{p.title}</span>
            <span className="inline-flex shrink-0 items-center gap-1 text-[12px] font-medium text-grey transition-colors group-hover:text-accent">
              {chat.viewProject} <ArrowRight size={12} />
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function Bubble({ message, onOpenProject }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      {/* dir="auto": Urdu and Arabic replies render right-to-left */}
      <p
        dir="auto"
        className={`max-w-[85%] break-words rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
          isUser ? 'rounded-br-md bg-dark text-white' : 'rounded-bl-md bg-surface text-ink'
        }`}
      >
        {isUser ? message.content : <FormattedText text={message.content} />}
      </p>
      {!isUser && message.projects?.length > 0 && <ProjectCards ids={message.projects} onOpen={onOpenProject} />}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start" aria-label="Typing">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-surface px-4 py-3.5">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-grey"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  // Conversation after the greeting; offline notices carry `error` and are never sent back
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [waiting, setWaiting] = useState(false)
  // Project the conversation is scoped to (set by "Ask AI about this project"); cleared when leaving its page
  const [scope, setScope] = useState(null)
  const { pathname } = useLocation()

  // On the home page the hero card has its own "Ask" button, so the floating launcher (and the theme
  // button above it) stays hidden until the hero is mostly scrolled past. Prevents two chat buttons at once.
  const [heroOnScreen, setHeroOnScreen] = useState(false)
  useEffect(() => {
    if (pathname !== '/') {
      setHeroOnScreen(false)
      return
    }
    let frame = 0
    const check = () => {
      frame = 0
      const hero = document.getElementById('home')
      setHeroOnScreen(Boolean(hero) && hero.getBoundingClientRect().bottom > window.innerHeight * 0.5)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    const timer = setTimeout(check, 0)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      clearTimeout(timer)
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])
  const launcherHidden = heroOnScreen && !open
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const mic = useSpeechInput(useCallback((text) => setInput(text.slice(0, 500)), []))
  const speaker = useSpeechOutput()
  const stopMic = mic.stop // stable callbacks
  const stopSpeaking = speaker.cancel

  useEffect(() => {
    if (open) inputRef.current?.focus()
    else {
      // Closing the chat stops the mic and any reply being read aloud
      stopMic()
      stopSpeaking()
    }
  }, [open, stopMic, stopSpeaking])

  const openProject = (id) => {
    setOpen(false)
    focusProject(id, navigate)
  }

  useEffect(() => {
    if (scope && pathname !== `/projects/${scope}`) setScope(null)
  }, [pathname, scope])

  // openChat() from elsewhere on the page (e.g. the Services section); with a question it is sent right away
  const sendRef = useRef(null)
  useEffect(() => {
    const onOpen = (e) => {
      setOpen(true)
      const { question, projectSlug } = e.detail ?? {}
      if (projectSlug) setScope(projectSlug)
      if (question) sendRef.current(question, projectSlug)
    }
    window.addEventListener('chat:open', onOpen)
    return () => window.removeEventListener('chat:open', onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, waiting])

  const send = async (text, projectSlug = scope) => {
    const content = text.trim()
    if (!content || waiting) return

    const next = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    stopMic()
    setWaiting(true)
    try {
      const history = next.filter((m) => !m.error).map(({ role, content }) => ({ role, content }))
      const { reply, projects: ids } = await sendChat(history, projectSlug)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, projects: ids }])
      if (speaker.enabled) speaker.speak(reply)
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: chat.offline, error: true }])
    } finally {
      setWaiting(false)
    }
  }

  sendRef.current = send

  const handleSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={chat.title}
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed bottom-[88px] left-3 right-3 z-[55] flex max-h-[min(520px,calc(100dvh-112px))] flex-col overflow-hidden rounded-2xl border border-border bg-paper shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:left-auto sm:right-5 sm:w-[360px]"
          >
            <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <span className="inline-block rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-medium text-grey">
                  {chat.chip}
                </span>
                <h2 className="mt-1.5 text-[17px] font-bold leading-snug">{chat.title}</h2>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {speaker.supported && (
                  <button
                    type="button"
                    onClick={speaker.toggle}
                    aria-pressed={speaker.enabled}
                    aria-label={speaker.enabled ? chat.voice.speakerOff : chat.voice.speakerOn}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-surface ${
                      speaker.enabled ? 'text-accent' : 'text-grey hover:text-ink'
                    }`}
                  >
                    {speaker.enabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-grey transition-colors hover:bg-surface hover:text-ink"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div ref={scrollRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              <Bubble message={{ role: 'assistant', content: chat.greeting }} />

              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {chat.suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-border px-3 py-1.5 text-[12px] font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m, i) => (
                <Bubble key={i} message={m} onOpenProject={openProject} />
              ))}
              {waiting && <TypingIndicator />}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border p-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mic.listening ? chat.voice.listening : chat.placeholder}
                aria-label="Message"
                maxLength={500}
                dir="auto"
                className="min-w-0 flex-1 rounded-full border border-border bg-paper px-4 py-2.5 text-[14px] text-ink outline-none transition-colors placeholder:text-muted focus:border-dark"
              />
              {mic.supported && (
                <button
                  type="button"
                  onClick={mic.listening ? mic.stop : mic.start}
                  aria-pressed={mic.listening}
                  aria-label={mic.listening ? chat.voice.micStop : chat.voice.micStart}
                  className={`relative flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border transition-colors ${
                    mic.listening
                      ? 'border-accent bg-accent text-white'
                      : 'border-border text-ink hover:border-dark'
                  }`}
                >
                  {mic.listening && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-30 motion-reduce:hidden" />
                  )}
                  <Mic size={17} className="relative" />
                </button>
              )}
              <button
                type="submit"
                disabled={waiting || !input.trim()}
                className="shrink-0 rounded-full bg-accent px-5 text-[14px] font-bold text-white transition-colors hover:bg-[#e62a2a] disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        aria-hidden={launcherHidden || undefined}
        className={`fixed bottom-5 right-5 z-[55] flex items-center gap-3 transition-all duration-300 ${
          launcherHidden ? 'pointer-events-none translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Theme button: centred above the avatar, hidden while the chat panel is open */}
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-[68px] right-[6px]"
            >
              <ThemeToggle />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!open && (
            <motion.button
              type="button"
              onClick={() => setOpen(true)}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="hidden rounded-2xl rounded-br-md border border-border bg-paper px-4 py-2.5 text-[14px] font-medium text-ink shadow-[0_6px_20px_rgba(0,0,0,0.08)] sm:block"
            >
              {chat.bubble}
            </motion.button>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close chat' : chat.title}
          data-no-tip={open ? undefined : ''}
          aria-expanded={open}
          className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-dark shadow-[0_8px_24px_rgba(0,0,0,0.2)] ring-2 ring-paper transition-transform hover:scale-105"
        >
          {open ? <X size={22} className="text-white" /> : <Avatar />}
        </button>
      </div>
    </>
  )
}
