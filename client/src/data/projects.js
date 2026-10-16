const GITHUB = 'https://github.com/CodeWithNouman99'

export const githubRepos = `${GITHUB}?tab=repositories`

export const projectFilters = ['All', 'Full-Stack', 'AI Automation', 'Frontend']

// "Ask AI about this project" chips on the detail page; a project's `askQuestions` overrides these
export const defaultAskQuestions = ['What problem does it solve?', 'How does it work?', 'What is it built with?']

// Images: src/assets/projects/<slug>.(png|jpg|jpeg|webp|avif) is the main image, <slug>-2, <slug>-3 …
// are gallery images (see lib/projectImages.js). Setting `image` here overrides the main image.
//
// Detail page (/projects/:slug) optional fields. Each section only appears once its field is filled:
//   overview:   string           (falls back to `short` while undefined)
//   problem:    string           → "The problem"
//   howItWorks: string[]         → "How it works", numbered steps
//   challenges: string           → "Challenges"
//   results:    string           → "Results" (real outcomes only)
//   summary:    { problem, solution, result } → three small cards under the header
//   askQuestions: string[]       → suggested chips in the "Ask AI about this project" box
// TODO: live URLs and screenshots for the remaining projects
export const projects = [
  {
    id: 'P01',
    slug: 'teammatch-ai',
    summary: {
      problem: 'Matching developers to a client request was done by hand: skills, free months and budget.',
      solution: 'AI steps in n8n read the request, check who is free, score candidates and build two teams.',
      result: 'Works end to end on sample requests: a Best Match and a Lowest Cost team in one run.',
    },
    title: 'TeamMatch AI',
    short: "Multi-agent system that matches a software house's developers to client requests.",
    category: ['Full-Stack', 'AI Automation'],
    status: 'Completed',
    tech: ['MERN', 'n8n', 'RAG'],
    github: `${GITHUB}/teammatch-ai`,
    live: null, // TODO
    image: null,
    featured: true,
    overview: "Turns a request like \"2 React Native + 1 Rails developer, 6 months, $12k a month\" into two ready teams: Best Match and Lowest Cost. Built solo in 1–2 weeks.",
    problem: undefined,
    howItWorks: undefined,
    challenges: "Gemini sometimes sent the JSON as plain text, so I added a Structured Output Parser. To stop double-booking, approved members are booked as tentative.",
    results: undefined,
    askQuestions: ['How do the agents work together?', 'How does it choose a team?', 'What was the hardest part?'],
  },
  {
    id: 'P02',
    slug: 'doctor-appointment',
    summary: {
      problem: 'Patients need a simple way to find a doctor and book a slot without calling the clinic.',
      solution: 'A MERN app where patients browse doctors by speciality and book, and doctors and admins manage schedules.',
      result: 'In progress: the patient pages are built, the backend is being built next.',
    },
    title: 'Doctor Appointment Booking System',
    short: 'Patients book, doctors manage schedules, admins oversee.',
    category: ['Full-Stack'],
    status: 'In Progress',
    tech: ['MERN'],
    github: `${GITHUB}/doctor-appointment-system-mern`,
    live: null, // TODO
    image: null,
    featured: false,
    overview: undefined, // TODO
    problem: undefined, // TODO
    howItWorks: undefined, // TODO: ['step 1', 'step 2', …]
    challenges: undefined, // TODO
    results: undefined, // TODO
  },
  {
    id: 'P03',
    slug: 'devbuddy',
    summary: {
      problem: 'A new developer\'s first week depends on someone being free to answer questions and assign tasks.',
      solution: 'HR adds the developer on a portal; an n8n AI buddy on WhatsApp answers from company docs and sends daily tasks.',
      result: 'HR portal and manager dashboard are live on Vercel, tested end to end with a WhatsApp welcome.',
    },
    title: 'DevBuddy',
    short: 'AI onboarding buddy for new developers at software houses.',
    category: ['Full-Stack', 'AI Automation'],
    status: 'Completed',
    tech: [], // TODO: confirm tech stack
    github: `${GITHUB}/devbuddy-portal`,
    live: 'https://devbuddy-portal.vercel.app',
    image: null,
    featured: true,
    overview: undefined, // TODO
    problem: undefined, // TODO
    howItWorks: undefined, // TODO: ['step 1', 'step 2', …]
    challenges: undefined, // TODO
    results: undefined, // TODO
  },
  {
    id: 'P04',
    slug: 'whatsapp-bot',
    summary: {
      problem: 'Booking, rescheduling or cancelling a clinic appointment usually means calling and waiting.',
      solution: 'A WhatsApp bot with an n8n AI agent that books, reschedules and cancels, with Google Sheets as the record.',
      result: 'Patients handle bookings in chat; reminders and Stripe payment confirmations go out automatically.',
    },
    title: 'WhatsApp Doctor Appointment Bot',
    short: 'AI agent that books, reschedules and cancels appointments.',
    category: ['AI Automation'],
    status: 'Completed',
    tech: ['n8n'],
    github: `${GITHUB}/n8n-automation-projects`,
    live: null, // TODO
    image: null,
    featured: true,
    overview: undefined, // TODO
    problem: undefined, // TODO
    howItWorks: undefined, // TODO: ['step 1', 'step 2', …]
    challenges: undefined, // TODO
    results: undefined, // TODO
    askQuestions: ['What problem does it solve?', 'How does booking on WhatsApp work?', 'How are reminders sent?'],
  },
  {
    id: 'P05',
    slug: 'hospital-rag',
    summary: {
      problem: 'Patients ask the same questions again and again, and the answers are buried in long PDFs.',
      solution: 'New PDFs in Google Drive are embedded into Pinecone, and an AI agent answers questions from them.',
      result: 'Answers come from the hospital\'s own documents; adding a PDF updates what it knows.',
    },
    title: 'Hospital RAG Agent',
    short: 'Answers hospital questions from a knowledge-base PDF.',
    category: ['AI Automation'],
    status: 'Completed',
    tech: ['n8n', 'Vector DB'],
    github: `${GITHUB}/n8n-automation-projects`,
    live: null, // TODO
    image: null,
    featured: true,
    overview: undefined, // TODO
    problem: undefined, // TODO
    howItWorks: undefined, // TODO: ['step 1', 'step 2', …]
    challenges: undefined, // TODO
    results: undefined, // TODO
    askQuestions: ['What problem does it solve?', 'How does it answer from PDFs?', 'What is RAG here?'],
  },
  {
    id: 'P06',
    slug: 'client-onboarding',
    summary: {
      problem: 'Every new client meant creating folders, a Slack channel, emails and a kickoff meeting by hand.',
      solution: 'An intake form sends to n8n, which routes by project type and sets up Drive, Slack, Gmail and Calendar.',
      result: 'One form submission sets up the whole client workspace for Web, Mobile or Automation projects.',
    },
    title: 'Client Onboarding Automation',
    short: '', // TODO: one-line description
    category: ['AI Automation'],
    status: 'Completed',
    tech: ['n8n'],
    github: `${GITHUB}/n8n-automation-projects`,
    live: null, // TODO
    image: null,
    featured: false,
    overview: undefined, // TODO
    problem: undefined, // TODO
    howItWorks: undefined, // TODO: ['step 1', 'step 2', …]
    challenges: undefined, // TODO
    results: undefined, // TODO
  },
  {
    id: 'P07',
    slug: 'hirehub',
    summary: {
      problem: 'Job seekers need one place to browse openings, and employers a quick way to post them.',
      solution: 'A React + Tailwind job portal with Clerk sign-in, job listings and a post-a-job flow.',
      result: 'Live on Vercel.',
    },
    title: 'HireHub',
    short: 'Job portal with Clerk auth.',
    category: ['Frontend'],
    status: 'Completed',
    tech: ['React', 'Tailwind', 'React Router', 'Clerk'],
    github: `${GITHUB}/Hire-Hub-Frontend`,
    live: 'https://hire-hub-frontend.vercel.app',
    image: null,
    featured: false,
    overview: undefined, // TODO
    problem: undefined, // TODO
    howItWorks: undefined, // TODO: ['step 1', 'step 2', …]
    challenges: undefined, // TODO
    results: undefined, // TODO
  },
  {
    id: 'P08',
    slug: 'cartify',
    summary: {
      problem: 'A shop front has to let people browse products and build a cart smoothly on any screen.',
      solution: 'A React e-commerce frontend with product listings, a cart and a responsive layout.',
      result: 'Live on Vercel, with the products page tuned for mobile.',
    },
    title: 'Cartify',
    short: 'E-commerce frontend.',
    category: ['Frontend'],
    status: 'Completed',
    tech: ['React'],
    github: `${GITHUB}/Cartify-React_Project`,
    live: 'https://cartify-react-project.vercel.app',
    image: null,
    featured: false,
    overview: undefined, // TODO
    problem: undefined, // TODO
    howItWorks: undefined, // TODO: ['step 1', 'step 2', …]
    challenges: undefined, // TODO
    results: undefined, // TODO
  },
]
