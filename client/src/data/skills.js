export const skillMarquee = [
  'MERN Stack',
  'AI Automation',
  'n8n Workflows',
  'RAG Agents',
  'REST APIs',
  'React',
  'Node.js',
  'MongoDB',
  'Multi-Agent Systems',
  'Problem Solving',
]

export const techStack = [
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'Tailwind CSS',
  'JavaScript',
  'n8n',
  'Gemini',
  'RAG',
  'Vector DB',
  'Git',
  'GitHub',
  'Vercel',
  'Oracle SQL',
  'Postman',
]

// Home "My stack" section (sections/TechStack.jsx). `icon` is a lucide-react icon name used there;
// `highlight` softly tints that box in red to mark it as the speciality.
export const techStackSection = {
  eyebrow: 'Tech I ship with',
  title: 'My stack',
  intro: 'The tools I use to build apps and the automations behind them.',
  groups: [
    { title: 'Frontend', note: 'What users see', icon: 'Monitor', items: ['React', 'JavaScript', 'Tailwind CSS'] },
    { title: 'Backend', note: 'APIs and data', icon: 'Server', items: ['Node.js', 'Express', 'MongoDB', 'REST APIs'] },
    { title: 'AI & Automation', note: 'My speciality', icon: 'Sparkles', items: ['n8n', 'Gemini', 'RAG', 'Vector DB'], highlight: true },
    { title: 'Tools', note: 'Ship and test', icon: 'Wrench', items: ['Git', 'GitHub', 'Vercel', 'Postman'] },
  ],
}
