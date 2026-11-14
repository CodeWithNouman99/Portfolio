// Shown as an n8n-style workflow: trigger → router → one node per service (Services.jsx).
// "Output" links: a project slug (from projects.js) or { label, action: 'chat' } to open the floating chat.
// `icon` picks the node icon in Services.jsx.
export const services = {
  eyebrow: 'What I do',
  title: 'I turn your team’s problems into running workflows.',
  watermark: 'Services',
  intro: 'Pick a node to see what I build, the tools I use and the projects that prove it.',
  file: 'nouman / my-services.json',
  status: 'Active',
  trigger: { label: 'New request', sub: 'Webhook' },
  router: { label: 'Nouman', sub: 'AI Agent · router' },
  execute: 'Execute workflow · see projects',
  panel: { node: 'Node', status: 'success', parameters: 'Parameters', output: 'Output' },
  items: [
    {
      id: '01',
      title: 'AI Automation with n8n',
      sub: 'n8n workflows',
      description:
        'Workflows that remove repetitive work: lead handling, bookings, onboarding, reminders and notifications across WhatsApp, Gmail, Sheets and Slack.',
      chips: ['n8n', 'Webhooks', 'Gmail', 'WhatsApp', 'Google Sheets'],
      links: ['whatsapp-bot', 'client-onboarding'],
      icon: 'workflow',
    },
    {
      id: '02',
      title: 'AI Chatbots & RAG Agents',
      sub: 'Answers from your docs',
      description: 'Assistants that answer from your own documents and data, using vector search and LLMs like Gemini.',
      chips: ['RAG', 'Pinecone', 'Gemini', 'AI Agents'],
      links: ['hospital-rag', { label: 'this portfolio’s chatbot', action: 'chat' }],
      icon: 'chat',
    },
    {
      id: '03',
      title: 'Multi-Agent & Internal Tools',
      sub: 'Agents that work together',
      description:
        'Internal tools where AI agents do the heavy lifting: matching people to work, onboarding new developers, tracking progress.',
      chips: ['Multi-agent', 'MERN', 'n8n'],
      links: ['teammatch-ai', 'devbuddy'],
      icon: 'agents',
    },
    {
      id: '04',
      title: 'Full-Stack Web Apps',
      sub: 'MERN, idea to deploy',
      description:
        'MERN applications from idea to deployment: React frontends, Express APIs and MongoDB, with auth and clean responsive UI.',
      chips: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind'],
      links: ['doctor-appointment', 'hirehub', 'cartify'],
      icon: 'code',
    },
  ],
}
