// image: path under src/assets/ (e.g. 'journey/uaf.png'). Missing files fall back to the dark tile
// and show up automatically once the file is added.
export const timeline = {
  eyebrow: 'Experience',
  title: 'My Journey',
  watermark: 'Journey',
  intro: 'From first lines of JavaScript to multi-agent AI systems.',
  items: [
    {
      id: '01',
      year: '2023',
      title: 'Started Software Engineering',
      subtitle: 'BS Software Engineering, University of Agriculture Faisalabad',
      image: 'journey/uaf.png',
    },
    {
      id: '02',
      year: '2025',
      title: 'Frontend Foundations',
      subtitle: 'JavaScript, React and Tailwind CSS: HireHub, Cartify',
      image: 'projects/hirehub.png',
    },
    {
      id: '03',
      year: '2025',
      title: 'Certified',
      subtitle:
        'Oracle OCI 2025 AI Foundations Associate · Microsoft & LinkedIn Career Essentials',
      image: 'journey/certified.png',
    },
    {
      id: '04',
      year: '2026',
      title: 'Went Full-Stack',
      subtitle: 'Node.js, Express and MongoDB: the MERN stack',
      image: 'projects/doctor-appointment.png',
    },
    {
      id: '05',
      year: '2026',
      title: 'AI Automation with n8n',
      subtitle: 'WhatsApp booking bot, hospital RAG agent, client onboarding',
      image: 'projects/whatsapp-bot.png',
    },
    {
      id: '06',
      year: '2026',
      title: 'TeamMatch AI',
      subtitle: 'Multi-agent system with MERN, n8n and RAG',
      image: 'projects/teammatch-ai.png',
    },
    {
      id: '07',
      year: 'Now',
      title: 'Open to Opportunities',
      subtitle: 'Internships & junior roles at software houses',
      image: 'journey/now.png',
    },
  ],
}
