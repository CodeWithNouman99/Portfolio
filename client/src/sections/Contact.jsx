import { useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Loader2, Mail } from 'lucide-react'
import { contact } from '../data/contact'
import { profile } from '../data/profile'
import { sendContact } from '../lib/api'
import { LinkedinIcon } from '../components/BrandIcons'
import AutomationTracker from '../components/AutomationTracker'
import WaveTexture from '../components/WaveTexture'
import useAutomationTracker from '../hooks/useAutomationTracker'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.2 } }

const EMPTY = { name: '', email: '', company: '', message: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const fields = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'company', label: 'Company', type: 'text', autoComplete: 'organization', optional: true, wide: true },
  { name: 'message', label: 'Message', textarea: true, wide: true },
]

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!values.email.trim()) errors.email = 'Please enter your email.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email.'
  if (!values.message.trim()) errors.message = 'Please write a message.'
  return errors
}

function Field({ field, value, error, onChange, inputRef }) {
  const id = `contact-${field.name}`
  const base = `w-full rounded-card border bg-paper px-4 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-dark ${
    error ? 'border-accent' : 'border-border'
  }`
  const props = {
    id,
    ref: inputRef,
    name: field.name,
    value,
    onChange,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
  }

  return (
    <div className={field.wide ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="mb-2 block text-[13px] font-bold text-ink">
        {field.label}
        {field.optional && <span className="ml-1 font-normal text-muted">(optional)</span>}
      </label>
      {field.textarea ? (
        <textarea {...props} rows={5} className={`${base} resize-y`} />
      ) : (
        <input {...props} type={field.type} autoComplete={field.autoComplete} className={base} />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[12px] leading-snug text-accent">
          {error}
        </p>
      )}
    </div>
  )
}

function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false) // live re-validation only after the first submit
  const [status, setStatus] = useState('idle') // idle | loading | tracking | error
  const [firstName, setFirstName] = useState('')
  const [lockedHeight, setLockedHeight] = useState(null)
  const cardRef = useRef(null)
  const firstFieldRef = useRef(null)
  const tracker = useAutomationTracker()
  const reduced = useReducedMotion()

  const handleChange = (e) => {
    const next = { ...values, [e.target.name]: e.target.value }
    setValues(next)
    if (touched) setErrors(validate(next))
    if (status === 'error') setStatus('idle')
  }

  // Swap the form for the tracker at the form's current height, so the card doesn't jump
  const showTracker = () => {
    setLockedHeight(cardRef.current?.offsetHeight ?? null)
    setFirstName(values.name.trim().split(/\s+/)[0])
    setStatus('tracking')
  }

  const backToForm = (nextStatus) => {
    tracker.reset()
    setLockedHeight(null)
    setStatus(nextStatus)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return

    const lead = {
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      message: values.message.trim(),
    }

    // Reduced motion: plain loading button, then the finished tracker with no animation
    if (reduced) {
      setStatus('loading')
      try {
        const data = await sendContact(lead)
        tracker.resolve(data, { instant: true })
        showTracker()
      } catch {
        setStatus('error')
      }
      return
    }

    // Steps 1–3 play while the server (and n8n) work; a failure flips back to the form's error state
    showTracker()
    tracker.start()
    try {
      const data = await sendContact(lead)
      await tracker.resolve(data)
    } catch {
      backToForm('error')
    }
  }

  const sendAnother = () => {
    setValues(EMPTY)
    setErrors({})
    setTouched(false)
    backToForm('idle')
    requestAnimationFrame(() => firstFieldRef.current?.focus({ preventScroll: true }))
  }

  const loading = status === 'loading'
  const tracking = status === 'tracking'
  const fade = reduced ? { duration: 0 } : { duration: 0.35, ease: 'easeOut' }

  return (
    <motion.div
      ref={cardRef}
      variants={fadeUp}
      {...inView}
      style={{ minHeight: tracking && lockedHeight ? lockedHeight : undefined }}
      className="relative mx-auto mt-14 grid max-w-[640px] rounded-card border border-border bg-paper p-6 text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-8"
    >
      {/* Form and tracker share one grid cell so they cross-fade in place */}
      <AnimatePresence initial={false}>
        {tracking ? (
          <motion.div
            key="tracker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { ...fade, delay: reduced ? 0 : 0.1 } }}
            exit={{ opacity: 0, transition: fade }}
            className="[grid-area:1/1]"
          >
            <AutomationTracker
              steps={tracker.steps}
              type={tracker.type}
              finished={tracker.finished}
              automation={tracker.automation}
              firstName={firstName}
              reduced={reduced}
              onReset={sendAnother}
              onHowBuilt={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            />
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: fade }}
            exit={{ opacity: 0, transition: fade }}
            onSubmit={handleSubmit}
            noValidate
            className="[grid-area:1/1]"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field, i) => (
                <Field
                  key={field.name}
                  field={field}
                  value={values[field.name]}
                  error={errors[field.name]}
                  onChange={handleChange}
                  inputRef={i === 0 ? firstFieldRef : undefined}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#e62a2a] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? contact.form.sending : contact.form.submit}
              </button>

              <div aria-live="polite" className="text-[14px] leading-snug">
                {status === 'error' && (
                  <p className="text-accent">
                    {contact.form.error}{' '}
                    <a href={`mailto:${profile.links.email}`} className="font-bold underline underline-offset-2">
                      {profile.links.email}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden pb-32 pt-20 md:pb-44 md:pt-28">
      <WaveTexture className="h-56 md:h-72" />

      <div className="relative mx-auto max-w-[1280px] px-4 text-center md:px-8">
        <span
          aria-hidden="true"
          className="watermark -top-4 left-1/2 -translate-x-1/2 md:-top-10"
        >
          {contact.watermark}
        </span>

        <motion.div variants={fadeUp} {...inView} className="relative">
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2 className="section-title mt-4">{contact.title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] text-muted md:text-base">
            {contact.subtitle}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`mailto:${profile.links.email}`}
              className="inline-flex max-w-full items-center gap-2 rounded-full bg-dark px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-black"
            >
              <Mail size={16} className="shrink-0" />
              <span className="truncate">{profile.links.email}</span>
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-paper px-6 py-3.5 text-sm font-bold text-ink transition-colors hover:border-dark"
            >
              <LinkedinIcon size={16} />
              LinkedIn
            </a>
          </div>
        </motion.div>

        <ContactForm />
      </div>
    </section>
  )
}
