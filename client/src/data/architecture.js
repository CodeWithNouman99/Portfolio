// "How it works" diagrams on the project pages (/projects/:slug), keyed by project slug.
// Projects without an entry don't show the block.
// Nodes: x/y are the node's centre on a 0–100 grid of the diagram area (desktop).
// Their array order is the reading order of the stacked mobile flow.
// `ai: true` gives the node a thin red border. Edges: [from, to] or [from, to, 'tool'] (dashed "uses" link),
// drawn in array order. `mainPath` is the route the red dot loops along. `note` (optional) sits under the diagram.
export const architectureText = {
  title: 'How it works',
  hint: 'Hover or tap a step to see what it does.',
  usesLabel: 'uses',
  fromLabel: 'from',
  toLabel: 'to',
}

export const architecture = {
  'teammatch-ai': {
    note: 'Approved team members are booked as tentative, so new requests see them as busy.',
    nodes: [
      { id: 'request', label: 'Client request (email / form)', tag: 'Input', x: 8, y: 18, note: 'A client asks the software house for developers.' },
      { id: 'dashboard', label: 'React dashboard', tag: 'React', x: 25, y: 18, note: 'Where the team sees incoming requests.' },
      { id: 'api', label: 'Express API', tag: 'Express', x: 42, y: 18, note: 'Saves the request and hands it to the n8n workflow.' },
      { id: 'n8n', label: 'n8n workflow', tag: 'n8n', x: 42, y: 50, note: 'Runs the AI steps one after another.' },
      { id: 'read', label: 'Read the request', tag: 'AI step', x: 24, y: 84, ai: true, note: 'Works out what the client actually needs.' },
      { id: 'free', label: 'Check who is free', tag: 'AI step', x: 44, y: 84, ai: true, note: 'Leaves out developers who are already booked.' },
      { id: 'score', label: 'Score every candidate', tag: 'AI step', x: 64, y: 84, ai: true, note: 'Rates each available developer against the request.' },
      { id: 'options', label: 'Build 2 team options', tag: 'AI step', x: 84, y: 84, ai: true, note: 'Turns the scores into two teams to choose from.' },
      { id: 'db', label: 'MongoDB', tag: 'MongoDB', x: 66, y: 18, note: 'Stores the requests and the team options.' },
      { id: 'approve', label: 'React dashboard (approve a team)', tag: 'React', x: 90, y: 18, note: 'A person picks a team; its members are booked as tentative.' },
    ],
    edges: [
      ['request', 'dashboard'],
      ['dashboard', 'api'],
      ['api', 'db'],
      ['api', 'n8n'],
      ['n8n', 'read'],
      ['read', 'free'],
      ['free', 'score'],
      ['score', 'options'],
      ['options', 'db'],
      ['db', 'approve'],
    ],
    mainPath: ['request', 'dashboard', 'api', 'n8n', 'read', 'free', 'score', 'options', 'db', 'approve'],
  },

  'ai-job-hunter': {
    note: 'If a workflow fails, WF5 Error Guard sends me a WhatsApp alert with the node and the error.',
    nodes: [
      { id: 'cv', label: 'CV PDF (upload form)', tag: 'Input', x: 8, y: 16, note: 'I upload my CV once through a form.' },
      { id: 'wf0', label: 'WF0 CV Brain', tag: 'Gemini', x: 30, y: 16, ai: true, note: 'Splits the CV into chunks and turns them into Gemini embeddings.' },
      { id: 'db', label: 'Supabase (pgvector)', tag: 'Supabase', x: 56, y: 16, note: 'Stores CV chunks, jobs, match scores, cover letters and applications.' },
      { id: 'sources', label: 'Remotive, RemoteOK, JSearch', tag: 'Job APIs', x: 8, y: 50, note: 'Remote jobs and Pakistan jobs from public job APIs.' },
      { id: 'wf1', label: 'WF1 Job Collector (daily 9 AM)', tag: 'n8n', x: 30, y: 50, note: 'Fetches new jobs, puts them in one shape and skips duplicates.' },
      { id: 'wf2', label: 'WF2 Job Matcher (RAG)', tag: 'AI step', x: 56, y: 50, ai: true, note: 'Finds the matching parts of my CV and scores each job 0–100 with Gemini.' },
      { id: 'wf3', label: 'WF3 Cover Letter Writer (daily 10 AM)', tag: 'AI step', x: 84, y: 50, ai: true, note: 'Writes a 150–220 word letter for jobs scoring 70+, using only real CV facts.' },
      { id: 'wa', label: 'WhatsApp: jobs · letter · applied', tag: 'WhatsApp', x: 8, y: 84, note: 'I message the assistant from my own number.' },
      { id: 'wf4', label: 'WF4 WhatsApp Assistant', tag: 'AI agent', x: 30, y: 84, ai: true, note: 'Shows my top jobs, sends a cover letter or marks a job as applied.' },
    ],
    edges: [
      ['cv', 'wf0'],
      ['wf0', 'db'],
      ['sources', 'wf1'],
      ['wf1', 'wf2'],
      ['wf2', 'db', 'tool'],
      ['wf2', 'wf3'],
      ['wf3', 'db', 'tool'],
      ['wa', 'wf4'],
      ['wf4', 'db', 'tool'],
    ],
    mainPath: ['sources', 'wf1', 'wf2', 'wf3'],
  },

  'whatsapp-bot': {
    nodes: [
      { id: 'trigger', label: 'WhatsApp Trigger', tag: 'WhatsApp', x: 8, y: 16, note: 'Starts the flow when a patient sends a message.' },
      { id: 'filter', label: 'Filter', tag: 'n8n', x: 27, y: 16, note: 'Passes on only the messages the bot should handle.' },
      { id: 'agent', label: 'AI Agent (Gemini + memory)', tag: 'AI agent', x: 50, y: 16, ai: true, note: 'Understands the message and books, reschedules or cancels.' },
      { id: 'reply', label: 'WhatsApp reply', tag: 'WhatsApp', x: 88, y: 16, note: "Sends the agent's answer back to the patient." },
      { id: 'sheets', label: 'Google Sheets: doctors, patients, appointments', tag: 'Tool', x: 38, y: 50, note: 'The data the agent reads and updates.' },
      { id: 'datetime', label: 'Date & Time', tag: 'Tool', x: 62, y: 50, note: 'Gives the agent the current date and time.' },
      { id: 'schedule', label: 'Schedule Trigger', tag: 'n8n', x: 8, y: 84, note: 'Runs the reminder flow on a schedule.' },
      { id: 'reminder', label: 'Reminder AI Agent', tag: 'AI agent', x: 26, y: 84, ai: true, note: 'Writes the reminder for upcoming appointments.' },
      { id: 'waReminder', label: 'WhatsApp reminder', tag: 'WhatsApp', x: 44, y: 84, note: 'Delivers the reminder to the patient.' },
      { id: 'stripe', label: 'Stripe Trigger', tag: 'Stripe', x: 66, y: 84, note: 'Starts when a payment comes in.' },
      { id: 'payment', label: 'Payment confirmation on WhatsApp', tag: 'WhatsApp', x: 88, y: 84, note: 'Confirms the payment to the patient.' },
    ],
    edges: [
      ['trigger', 'filter'],
      ['filter', 'agent'],
      ['agent', 'sheets', 'tool'],
      ['agent', 'datetime', 'tool'],
      ['agent', 'reply'],
      ['schedule', 'reminder'],
      ['reminder', 'waReminder'],
      ['stripe', 'payment'],
    ],
    mainPath: ['trigger', 'filter', 'agent', 'reply'],
  },

  'hospital-rag': {
    nodes: [
      { id: 'drive', label: 'Google Drive Trigger (new PDF)', tag: 'Google Drive', x: 10, y: 22, note: 'Starts when a new PDF is added to the folder.' },
      { id: 'download', label: 'Download file', tag: 'n8n', x: 36, y: 22, note: 'Fetches the PDF so it can be processed.' },
      { id: 'embed', label: 'Gemini embeddings', tag: 'Gemini', x: 63, y: 22, ai: true, note: 'Turns the document text into vectors.' },
      { id: 'pinecone', label: 'Pinecone vector store', tag: 'Pinecone', x: 89, y: 22, note: 'Keeps the vectors so they can be searched.' },
      { id: 'chat', label: 'Chat message', tag: 'n8n', x: 10, y: 78, note: 'A question comes in from the chat.' },
      { id: 'agent', label: 'AI Agent (Gemini + memory)', tag: 'AI agent', x: 36, y: 78, ai: true, note: 'Decides what to look up and writes the answer.' },
      { id: 'tool', label: 'Hospital Data (Pinecone search)', tag: 'Tool', x: 63, y: 78, note: 'Finds the most relevant parts of the documents.' },
      { id: 'answer', label: "Answer from the hospital's documents", tag: 'Output', x: 89, y: 78, note: 'The reply is based on what the PDFs say.' },
    ],
    edges: [
      ['drive', 'download'],
      ['download', 'embed'],
      ['embed', 'pinecone'],
      ['chat', 'agent'],
      ['agent', 'tool'],
      ['tool', 'answer'],
    ],
    mainPath: ['chat', 'agent', 'tool', 'answer'],
  },

  'devbuddy': {
    note: 'A separate daily flow sends each developer their next task and alerts the manager.',
    nodes: [
      { id: 'portal', label: 'HR portal (React)', tag: 'React', x: 8, y: 20, note: 'HR adds a new developer with a short form.' },
      { id: 'webhook', label: 'n8n Webhook', tag: 'n8n', x: 30, y: 20, note: 'Receives the new developer from the portal.' },
      { id: 'sheet', label: 'Google Sheets: developers & progress', tag: 'Google Sheets', x: 54, y: 20, note: 'Keeps each developer and the tasks they have finished.' },
      { id: 'welcome', label: 'WhatsApp welcome', tag: 'WhatsApp', x: 80, y: 20, note: 'The new developer gets a welcome message on day one.' },
      { id: 'msg', label: 'WhatsApp message', tag: 'WhatsApp', x: 8, y: 80, note: 'The developer asks a question or says a task is done.' },
      { id: 'agent', label: 'AI Buddy (Gemini)', tag: 'AI agent', x: 32, y: 80, ai: true, note: 'Answers from company docs, logs questions and marks tasks done.' },
      { id: 'docs', label: 'Company docs', tag: 'Tool', x: 32, y: 50, note: 'The onboarding documents the buddy answers from.' },
      { id: 'reply', label: 'WhatsApp reply', tag: 'WhatsApp', x: 56, y: 80, note: "Sends the buddy's answer back." },
      { id: 'dashboard', label: 'Manager dashboard', tag: 'React', x: 84, y: 80, note: 'The manager sees each new developer’s progress.' },
    ],
    edges: [
      ['portal', 'webhook'],
      ['webhook', 'sheet'],
      ['sheet', 'welcome'],
      ['msg', 'agent'],
      ['agent', 'docs', 'tool'],
      ['agent', 'sheet', 'tool'],
      ['agent', 'reply'],
      ['sheet', 'dashboard'],
    ],
    mainPath: ['msg', 'agent', 'reply'],
  },

  'client-onboarding': {
    nodes: [
      { id: 'form', label: 'Intake website', tag: 'Website', x: 8, y: 25, note: 'The new client fills in one form.' },
      { id: 'webhook', label: 'n8n Webhook', tag: 'n8n', x: 30, y: 25, note: 'Receives the form and starts the workflow.' },
      { id: 'log', label: 'Log to client sheet', tag: 'Google Sheets', x: 52, y: 25, note: 'Saves the client details.' },
      { id: 'switch', label: 'Switch: project type', tag: 'n8n', x: 76, y: 25, note: 'Sends Web, Mobile and Automation clients down their own branch.' },
      { id: 'drive', label: 'Drive folders', tag: 'Google Drive', x: 16, y: 78, note: 'Creates the client folder with Contracts, Deliverables and Meeting Notes.' },
      { id: 'slack', label: 'Slack channel + message', tag: 'Slack', x: 40, y: 78, note: 'Opens a channel for the project and posts the first message.' },
      { id: 'gmail', label: 'Welcome email', tag: 'Gmail', x: 64, y: 78, note: 'Sends the client a welcome email.' },
      { id: 'calendar', label: 'Kickoff meeting', tag: 'Calendar', x: 88, y: 78, note: 'Books the kickoff meeting in Google Calendar.' },
    ],
    edges: [
      ['form', 'webhook'],
      ['webhook', 'log'],
      ['log', 'switch'],
      ['switch', 'drive'],
      ['drive', 'slack'],
      ['slack', 'gmail'],
      ['gmail', 'calendar'],
    ],
    mainPath: ['form', 'webhook', 'log', 'switch', 'drive', 'slack', 'gmail', 'calendar'],
  },

  'doctor-appointment': {
    note: 'The frontend is built; the backend is in progress.',
    nodes: [
      { id: 'patient', label: 'Patient pages (React)', tag: 'React', x: 12, y: 28, note: 'Patients browse doctors by speciality and book a slot.' },
      { id: 'panel', label: 'Doctor & admin panel (React)', tag: 'React', x: 12, y: 76, note: 'Doctors manage their schedule; admins oversee everything.' },
      { id: 'api', label: 'Express API', tag: 'Express', x: 50, y: 52, note: 'REST endpoints for doctors and bookings (in progress).' },
      { id: 'db', label: 'MongoDB', tag: 'MongoDB', x: 86, y: 52, note: 'Stores doctors, patients and appointments.' },
    ],
    edges: [
      ['patient', 'api'],
      ['panel', 'api'],
      ['api', 'db'],
    ],
    mainPath: ['patient', 'api', 'db'],
  },

  'hirehub': {
    nodes: [
      { id: 'app', label: 'React + Tailwind UI', tag: 'React', x: 12, y: 30, note: 'The job portal the visitor sees.' },
      { id: 'clerk', label: 'Clerk sign-in', tag: 'Auth', x: 12, y: 78, note: 'Handles sign up and sign in.' },
      { id: 'router', label: 'React Router pages', tag: 'React Router', x: 46, y: 30, note: 'Home, jobs, about and contact pages.' },
      { id: 'jobs', label: 'Job listings', tag: 'Page', x: 82, y: 30, note: 'Visitors browse open jobs.' },
      { id: 'post', label: 'Post a job', tag: 'Page', x: 82, y: 78, note: 'Employers add a new job listing.' },
    ],
    edges: [
      ['app', 'clerk', 'tool'],
      ['app', 'router'],
      ['router', 'jobs'],
      ['router', 'post'],
    ],
    mainPath: ['app', 'router', 'jobs'],
  },

  'cartify': {
    nodes: [
      { id: 'app', label: 'React app', tag: 'React', x: 10, y: 50, note: 'The storefront, responsive on mobile and desktop.' },
      { id: 'api', label: 'Products API', tag: 'API', x: 36, y: 50, note: 'Product data is loaded from an API.' },
      { id: 'list', label: 'Product listings', tag: 'Page', x: 62, y: 50, note: 'Visitors browse the products.' },
      { id: 'cart', label: 'Cart', tag: 'State', x: 88, y: 50, note: 'Visitors add products and see their cart.' },
    ],
    edges: [
      ['app', 'api'],
      ['api', 'list'],
      ['list', 'cart'],
    ],
    mainPath: ['app', 'api', 'list', 'cart'],
  },
}
