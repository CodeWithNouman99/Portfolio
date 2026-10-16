// "See it in" links: a project slug (from projects.js) or { label, action: 'chat' } to open the floating chat.
// `illustration` picks the animated mini-scene in Services.jsx.
export const services = {
  eyebrow: 'What I do',
  title: 'How I can help your team',
  watermark: 'Services',
  intro: 'From full-stack apps to AI automations that save hours every week.',
  seeItIn: 'See it in:',
  items: [
    {
      id: '01',
      title: 'Full-Stack Web Apps',
      description:
        'MERN applications from idea to deployment: React frontends, Express APIs and MongoDB, with auth and clean responsive UI.',
      chips: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind'],
      links: ['doctor-appointment', 'hirehub', 'cartify'],
      illustration: 'code',
    },
    {
      id: '02',
      title: 'AI Automation with n8n',
      description:
        'Workflows that remove repetitive work: lead handling, bookings, onboarding, reminders and notifications across WhatsApp, Gmail, Sheets and Slack.',
      chips: ['n8n', 'Webhooks', 'Gmail', 'WhatsApp', 'Google Sheets'],
      links: ['whatsapp-bot', 'client-onboarding'],
      illustration: 'flow',
    },
    {
      id: '03',
      title: 'AI Chatbots & RAG Agents',
      description: 'Assistants that answer from your own documents and data, using vector search and LLMs like Gemini.',
      chips: ['RAG', 'Pinecone', 'Gemini', 'AI Agents'],
      links: ['hospital-rag', { label: 'this portfolio’s chatbot', action: 'chat' }],
      illustration: 'chat',
    },
    {
      id: '04',
      title: 'Multi-Agent & Internal Tools',
      description:
        'Internal tools where AI agents do the heavy lifting: matching people to work, onboarding new developers, tracking progress.',
      chips: ['Multi-agent', 'MERN', 'n8n'],
      links: ['teammatch-ai', 'devbuddy'],
      illustration: 'agents',
    },
  ],
}
