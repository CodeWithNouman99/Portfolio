// Instant answers for the chat widget's suggestion chips (client/src/data/chat.js → suggestions),
// written from server/knowledge/nouman.md. No AI call, same { reply, projects } shape.
// If a chip's wording changes on the client, update its key here too.
const ANSWERS = {
  'what has he built': {
    reply:
      "Nouman has built 8 projects, from full-stack MERN apps to AI automations. His flagship work is **TeamMatch AI**, a multi-agent system that matches a software house's developers to client requests, alongside DevBuddy, an AI onboarding buddy for new developers. He has also built n8n agents such as a WhatsApp doctor appointment bot and a hospital RAG agent.",
    projects: ['P01', 'P03'],
  },
  'is he open to internships': {
    reply:
      "Yes! Nouman is open to internships and junior roles, especially at software houses, and also to freelance automation work. The best way to reach him is by email at mrnoumannomi7@gmail.com or on LinkedIn.",
    projects: [],
  },
  'whats his tech stack': {
    reply:
      'On the frontend he works with React.js, JavaScript (ES6+), Tailwind CSS, Context API and React Router. On the backend he uses Node.js, Express.js, REST APIs, MongoDB and Oracle SQL, and for AI automation he builds with n8n, Gemini, RAG with vector databases and multi-agent systems. His everyday tools are Git, GitHub, Postman and Vercel.',
    projects: [],
  },
}

// "What's his tech stack?" → "whats his tech stack"
const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

// messages: validated chat history ending with a user turn → { reply, projects } or null
export function quickAnswer(messages) {
  const answer = ANSWERS[normalize(messages.at(-1).content)]
  return answer ? { reply: answer.reply, projects: [...answer.projects] } : null
}
