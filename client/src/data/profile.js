export const profile = {
  name: 'Nouman Aslam',
  firstName: 'Nouman',
  lastName: 'Aslam',
  location: 'Faisalabad, Pakistan',
  role: 'MERN Stack Developer & AI Automation Builder',
  availability: 'Open to internships & junior roles',
  tagline: 'Code that ships, not just compiles.',

  education: {
    degree: 'BS Software Engineering',
    institution: 'University of Agriculture Faisalabad',
    period: '2023 – present',
    cgpa: '3.52/4.0',
  },

  stack: [
    'React.js',
    'JavaScript (ES6+)',
    'Tailwind CSS',
    'Context API',
    'Node.js',
    'Express.js',
    'MongoDB',
    'REST APIs',
    'n8n',
    'Gemini',
    'RAG / vector DBs',
    'Git',
    'Oracle SQL',
  ],

  links: {
    github: 'https://github.com/CodeWithNouman99',
    linkedin: 'https://www.linkedin.com/in/nouman-aslam-a9a3a2333',
    email: 'mrnoumannomi7@gmail.com',
  },

  // Hero "IMPACT" card. value: number with an optional suffix ("5+"); it counts up from 0 on first view.
  // Labels are shown exactly as written (no CSS uppercasing, so "n8n" keeps its lowercase).
  stats: [
    { value: '3', label: 'WEB APPS BUILT' },
    { value: '5+', label: 'n8n AUTOMATIONS' },
    { value: '3.52', label: 'CGPA / 4.0' },
  ],

  // Hero CV buttons. They always show; until client/public/cv.pdf exists, clicking them shows `missing`
  // (followed by the email) instead of a broken link.
  cvUrl: '/cv.pdf',
  cv: {
    view: 'View CV',
    download: 'Download CV',
    fileName: 'Nouman-Aslam-CV.pdf',
    missing: 'CV coming soon. Email me for a copy:',
  },

  // TODO: hero cut-out photo — drop a transparent PNG at src/assets/hero.png (picked up automatically)

  hero: {
    kicker: 'Hy! I am',
    intro:
      'I build full-stack MERN apps and the AI automations that run behind them. Code that ships, not just compiles.',
    bullets: [
      'MERN Stack Developer',
      'AI Automation Builder @ n8n',
      'Software Engineering @ UAF',
      'Open to Internships & Junior Roles',
    ],
    // Shown exactly as written (no CSS uppercasing), so "n8n" keeps its lowercase like in the stats
    floatingTags: ['MERN DEVELOPER', 'AI AUTOMATION', 'n8n BUILDER', 'PROBLEM SOLVER'],
    statsNote: 'Based in Faisalabad, Pakistan',
  },

  // TODO: cartoon avatar for the AI chat widget → src/assets
  chatAvatar: null,
}
