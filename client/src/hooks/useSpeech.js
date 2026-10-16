import { useCallback, useEffect, useRef, useState } from 'react'

const Recognition =
  typeof window === 'undefined' ? null : window.SpeechRecognition || window.webkitSpeechRecognition || null
const synthSupported =
  typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window

// Speech-to-text via the Web Speech API. onText(transcript) fires with interim and final text.
// supported is false in browsers without SpeechRecognition (e.g. Firefox), so callers can hide the mic.
export function useSpeechInput(onText) {
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)
  const onTextRef = useRef(onText)

  useEffect(() => {
    onTextRef.current = onText
  }, [onText])

  // Stop listening on unmount
  useEffect(() => () => recRef.current?.abort(), [])

  const stop = useCallback(() => recRef.current?.stop(), [])

  const start = useCallback(() => {
    if (!Recognition || recRef.current) return
    const rec = new Recognition()
    rec.lang = navigator.language || 'en-US'
    rec.interimResults = true
    rec.continuous = false
    rec.onresult = (e) => onTextRef.current(Array.from(e.results, (r) => r[0].transcript).join(''))
    rec.onend = () => {
      recRef.current = null
      setListening(false)
    }
    // not-allowed, no-speech, network…: onend follows and resets the button
    rec.onerror = () => {}
    recRef.current = rec
    try {
      rec.start()
      setListening(true)
    } catch {
      recRef.current = null
    }
  }, [])

  return { supported: Boolean(Recognition), listening, start, stop }
}

// Guess a speech language from the script: Urdu-only letters → Urdu, other Arabic script → Arabic
function speechLang(text) {
  if (/[ٹڈڑںےۓ]/.test(text)) return 'ur-PK'
  if (/[؀-ۿ]/.test(text)) return 'ar-SA'
  return 'en-US'
}

// Text-to-speech via speechSynthesis. speak() strips the **bold** markers before reading.
export function useSpeechOutput() {
  const [enabled, setEnabled] = useState(false)

  const cancel = useCallback(() => {
    if (synthSupported) window.speechSynthesis.cancel()
  }, [])

  const speak = useCallback((text) => {
    if (!synthSupported) return
    const clean = text.replace(/\*+/g, '').trim()
    if (!clean) return
    const lang = speechLang(clean)
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = lang
    const prefix = lang.slice(0, 2)
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith(prefix))
    if (voice) utterance.voice = voice
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }, [])

  const toggle = useCallback(() => {
    if (enabled) cancel()
    setEnabled(!enabled)
  }, [enabled, cancel])

  // Never keep talking after the widget unmounts
  useEffect(() => cancel, [cancel])

  return { supported: synthSupported, enabled, toggle, speak, cancel }
}
