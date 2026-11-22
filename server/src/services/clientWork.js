// No client work is listed yet, and models can't be trusted to always say so (one named a demo restaurant
// as a client). So questions about clients get their answer from here, never in a model's own words.
// They're spotted twice: by the patterns below (no AI call), and by the "clientQuestion" flag the
// models return for other wordings and languages.
// When real client work gets listed, update this file and the "Client work" rule in chatPrompt.js.

const CLIENT_QUESTIONS = [
  /\b(who (are|were|is)|list|name) (his|the|your|nouman['’]?s|those|these) ([\w-]+ )?(clients?|customers?|clinics|hospitals|restaurants)\b/i,
  /\b(has|have|had|does|did|do|any|past|previous|current|existing|real) ((he|you|nouman) )?((have|has|had|got|any|real|paying|freelance|past) )*(clients|customers)\b/i,
  /\b(has|have|had|did) (he|you|nouman) (ever )?(work|worked|freelance|freelanced) for\b/i,
  /\b(which|what|whose) (clinic|hospital|restaurant|company|business|gym|client|software house)\b.*\b(uses?|used|using|for|hired|paid)\b/i,
  /\b(testimonials?|client work|who (has )?(paid|hired) (him|you|nouman))\b/i,
  /\bkis(i|\s)\b.*\bke? (liye|lie|liay) kaa?m kiy?a\b/i,
]

// "Does he take clients?" is about availability
const TAKING_WORK = /\b(take|takes|taking|accept|accepts|accepting) (on )?(new |freelance )*clients\b/i

// "Does he build bots for gyms?" is a sales question; models sometimes flag it as a client question
const CAN_BUILD = /^(can|could|does|do|will|would) (he|you|nouman) (build|make|create|develop)\b(?!.*\b(clients|customers)\b)/i

// "Has he built a Next.js project for production?" is a skills question; models sometimes flag it too
const TECH = /\b(next\.?js|react|node(\.?js)?|express|mongo(db)?|postgre(s|sql)|supabase|sql|tailwind|javascript|typescript|docker|python|n8n|gemini|rag)\b/i

export const isCapabilityQuestion = (text) => CAN_BUILD.test(text) || TECH.test(text)

export const isClientQuestion = (text) =>
  !TAKING_WORK.test(text) && CLIENT_QUESTIONS.some((pattern) => pattern.test(text))

// The projects to point to, by the field the question is about
const RELATED = [
  [/hospital|ہسپتال|مستشفى/i, ['P07', 'P05']],
  [/clinic|doctor|patient|کلینک|ڈاکٹر|عيادة/i, ['P05', 'P08']],
  [/restaurant|receptionist|ریسٹورنٹ|مطعم/i, ['P02']],
  [/software house|agency|developers/i, ['P03', 'P01']],
]
const DEFAULT_PROJECTS = ['P05', 'P02']

const REPLIES = {
  en: (names) =>
    `No client work is listed yet. You can look at his own projects instead, like ${names.join(' and ')}. For pricing or anything else, email mrnoumannomi7@gmail.com.`,
  romanUrdu: (names) =>
    `Abhi koi client work listed nahi hai. Aap Nouman ke apne projects dekh sakte hain, jaise ${names.join(' aur ')}. Pricing ya kisi aur sawal ke liye mrnoumannomi7@gmail.com par email karein.`,
  urdu: (names) =>
    `ابھی کوئی کلائنٹ ورک درج نہیں ہے۔ آپ نعمان کے اپنے پروجیکٹس دیکھ سکتے ہیں، جیسے ${names.join(' اور ')}۔ قیمت یا کسی اور سوال کے لیے mrnoumannomi7@gmail.com پر ای میل کریں۔`,
  arabic: (names) =>
    `لا توجد أعمال لعملاء مدرجة حتى الآن. يمكنك الاطلاع على مشاريعه الخاصة، مثل ${names.join(' و ')}. للأسعار أو أي سؤال آخر، راسله على mrnoumannomi7@gmail.com.`,
}

function languageOf(text) {
  if (/[ٹڈڑںےگچپکیہ]/.test(text)) return 'urdu'
  if (/[؀-ۿ]/.test(text)) return 'arabic'
  if (/\b(kya|hai|hain|kisi|kis|nahi|kiya|kia|liye|uske|unke|kaun|kon|koi)\b/i.test(text)) return 'romanUrdu'
  return 'en'
}

// question: the visitor's last message; titles: id → title; pageId: the project page they asked from
export function clientWorkAnswer(question, titles, pageId) {
  const related = RELATED.find(([pattern]) => pattern.test(question))?.[1] ?? DEFAULT_PROJECTS
  const projects = pageId ? [pageId] : related
  return { reply: REPLIES[languageOf(question)](projects.map((id) => titles.get(id))), projects: [...projects] }
}
