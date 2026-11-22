// Home "My stack" section (sections/TechStack.jsx): an orbit around `core`, one ring per entry.
// Rings run from the centre outwards. `size` is the ring's diameter as a share of the orbit's width;
// `seconds` is one full turn. `tone` styles the pills and the legend dot: 'accent' | 'default' | 'muted'.
export const techStackSection = {
  eyebrow: 'Tech I ship with',
  title: 'My stack',
  intro: 'The tools I use to build apps and the automations behind them.',
  core: { label: 'n8n', note: 'Core' },
  rings: [
    {
      id: 'ai',
      legend: 'Inner orbit · AI and automation',
      tone: 'accent',
      size: 0.4,
      seconds: 40,
      items: ['Gemini', 'RAG', 'Vector DB', 'WhatsApp API'],
    },
    {
      id: 'backend',
      legend: 'Middle orbit · Backend and data',
      tone: 'default',
      size: 0.6,
      seconds: 60,
      items: ['Node.js', 'Express', 'MongoDB', 'REST APIs'],
    },
    {
      id: 'frontend',
      legend: 'Outer orbit · Frontend and tools',
      tone: 'muted',
      size: 0.8,
      seconds: 90,
      items: ['React', 'JavaScript', 'Tailwind CSS', 'Vite', 'Git', 'Vercel', 'Postman'],
    },
  ],
}
