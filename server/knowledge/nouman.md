# Nouman Aslam — knowledge base

Source of truth for the portfolio chat assistant. Every line is a fact taken from the portfolio's own data.
If something is not written here, it is not known.

## Basics
- Full name: Nouman Aslam.
- Location: Faisalabad, Pakistan.
- Role: MERN Stack Developer & AI Automation Builder.
- Tagline: "Code that ships, not just compiles."
- Summary: Software engineering student who builds full-stack MERN products and the AI automations that run behind them (n8n workflows, RAG agents, multi-agent systems, Gemini).

## Availability
- Open to freelance projects AND to internships and junior roles (especially at software houses).
- Job goal, alongside freelance projects: an internship or junior role at a software house where he can ship real products, learn from senior engineers, and bring AI automation into everyday engineering work.
- Best way to reach him: email mrnoumannomi7@gmail.com, or LinkedIn.

## Freelance work
- He takes freelance projects.
- What he can build: WhatsApp AI bots, voice receptionists, n8n automations and RAG chatbots.
- Who these services are for: small businesses (such as clinics, restaurants and gyms) and software houses. These are the kinds of business he would like to work with. None of them is listed as a past or current client.
- How to start: email mrnoumannomi7@gmail.com or use the contact form on this portfolio.
- Pricing: depends on scope.
- When asked whether he builds or can build something for a type of business (for example "Does he build bots for gyms?"), start with "Yes, he can build" and do not open with the client-work line.
- When asked only whether he takes freelance work, reply with just this short answer (translated to the visitor's language) and add nothing else: "Yes. Nouman can build WhatsApp bots, voice agents and n8n automations for your business. Email him at mrnoumannomi7@gmail.com to discuss your project."

## Contact & links
- Email: mrnoumannomi7@gmail.com
- LinkedIn: https://www.linkedin.com/in/nouman-aslam-a9a3a2333
- GitHub: https://github.com/CodeWithNouman99
- All of his projects are on GitHub, each with a README explaining how it works.
- Live demos: DevBuddy https://devbuddy-portal.vercel.app, TableTalk AI https://elevenlabs.io/app/talk-to?agent_id=agent_0101m7ndx4kyfbv818qrs81hb9ce, HireHub https://hire-hub-frontend.vercel.app, Doctor Appointment Booking System https://doctor-appointment-frontend-azure.vercel.app, Cartify https://cartify-react-project.vercel.app. The other projects have no live demo yet.

## Impact (numbers shown on the portfolio)
- 3 web apps built.
- 8+ n8n automations built.
- CGPA 3.51 / 4.0.

## Education
- BS Software Engineering, University of Agriculture Faisalabad (UAF).
- Period: 2023 – present (currently studying).
- CGPA: 3.51 / 4.0.

## Certifications
1. Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate — issued by Oracle University, Aug 2025, valid until Aug 2027.
2. Career Essentials in Software Development — issued by Microsoft & LinkedIn Learning, Mar 2025. A learning path covering Programming and Software Development.
3. Building Apps and AI Agents with Claude Code — issued by Coursera, Oct 2026.
- Total: 3 certifications.

## Skills & tech stack
- Frontend: React.js, JavaScript (ES6+), Tailwind CSS, Context API, React Router, Vite, HTML5/CSS3, Next.js (basics only).
- Next.js: basic familiarity only, no projects built with it yet. If asked, say he knows the basics but hasn't shipped a Next.js project, in the visitor's language. Keep "Next.js (basics only)" whenever you list his frontend skills.
- Backend: Node.js, Express.js, REST APIs.
- Databases: MongoDB, Oracle SQL, vector databases, PostgreSQL through Supabase.
- PostgreSQL: used via Supabase in the AI Job Hunter project (P04). No other PostgreSQL use is listed. Always include "via Supabase" and do not describe it as wider experience.
- AI & automation: n8n, Gemini, RAG (retrieval-augmented generation), AI agents, multi-agent systems, WhatsApp Cloud API.
- Tools: Git, GitHub, Vercel, Postman, Claude Code (AI coding tool).
- Authentication: Clerk (used in HireHub).
- Strengths he highlights: MERN stack, AI automation, n8n workflows, RAG agents, REST APIs, multi-agent systems, problem solving.
- When asked if he knows or fits a list of skills, cover every skill asked, and name each one that is not in this file (for example Docker) as not listed. Do not add promises to learn them. Asking whether he knows, has used, built or shipped a project with a technology (including "for production") is a skills question: "clientQuestion" is false and client work is not mentioned.

## How he works
- Starts from the problem, not the tool.
- Breaks work into small pieces, ships a working version fast, then improves it.
- Builds end to end: the interface, the API, the database, and the automation behind them.

## Projects (10 in total)

### P03 — TeamMatch AI
- Multi-agent system that matches a software house's developers to client requests.
- Tech: MERN stack, n8n, RAG.
- Category: Full-Stack + AI Automation. Status: Completed. Flagship project.
- Code: https://github.com/CodeWithNouman99/teammatch-ai

### P08 — Doctor Appointment Booking System
- Full-stack app where patients book appointments, doctors manage their schedules, and admins oversee everything.
- Tech: MERN stack.
- Category: Full-Stack. Status: Completed.
- Code: https://github.com/CodeWithNouman99/doctor-appointment-system-mern
- Live demo: https://doctor-appointment-frontend-azure.vercel.app

### P01 — DevBuddy
- AI onboarding buddy for new developers joining software houses.
- Tech: full MERN app (React, Express, MongoDB) with n8n workflows and a WhatsApp AI agent. Google Sheets is no longer used.
- Category: Full-Stack + AI. Status: Completed. Flagship project.
- Code: https://github.com/CodeWithNouman99/devbuddy-portal
- Live demo: https://devbuddy-portal.vercel.app

### P02 — TableTalk AI
- Voice receptionist that books, changes and cancels restaurant tables in Urdu and English. Newest project.
- Tech: ElevenLabs Agents (voice AI), n8n (self-hosted), Google Sheets, ngrok.
- Category: AI Automation. Status: Completed.
- The voice agent is called Ayesha. It runs on demo restaurant data; it was not built for a restaurant client. Callers can speak Urdu or English.
- Ayesha answers menu, deals, timing, parking and policy questions from a knowledge base, so prices are never made up.
- She uses two webhook tools that call n8n: book_reservation (sends name, phone, date, time, guests and seating; n8n creates a reservation ID like LTH-261118004454 and appends one row to a Google Sheet) and update_reservation (finds the booking by phone number, then changes or cancels it).
- Each booking is one row in the sheet with status Confirmed, Changed or Cancelled. Ayesha reads the reservation ID back to the caller.
- Wrong cancels are prevented by an n8n IF check: a booking is only cancelled when no new date, time or guests were sent.
- Duplicate bookings were a problem at first; they were fixed by returning a simple JSON response from n8n and adding a "call the tool only once" rule to the agent.
- Book, change and cancel were tested end to end on real calls.
- Code: https://github.com/CodeWithNouman99/n8n-automation-projects/tree/main/tabletalk-ai
- Live demo (talk to Ayesha): https://elevenlabs.io/app/talk-to?agent_id=agent_0101m7ndx4kyfbv818qrs81hb9ce. Menu questions work anytime; bookings save to the sheet only during demo hours.

### P04 — AI Job Hunter
- AI job assistant that runs on WhatsApp: finds remote and Pakistan jobs, scores them against his CV with RAG and writes cover letters.
- Tech: n8n, Gemini, Supabase (PostgreSQL with pgvector), RAG.
- Category: AI Automation. Status: Completed.
- Every day it pulls jobs from Remotive, RemoteOK and JSearch, scores each one 0–100 against his CV and writes cover letters for the strong matches (70+).
- Built as six n8n workflows (WF0–WF5); top jobs, cover letters and applications are managed from WhatsApp.
- Code: https://github.com/CodeWithNouman99/n8n-automation-projects/tree/main/ai-job-hunter
- No live demo (pure automation, no website).

### P05 — WhatsApp Doctor Appointment Bot
- AI agent on WhatsApp that books, reschedules and cancels doctor appointments.
- Tech: n8n.
- Category: AI Automation. Status: Completed.
- Code: https://github.com/CodeWithNouman99/n8n-automation-projects

### P07 — Hospital RAG Agent
- AI agent that answers hospital questions from a knowledge-base PDF.
- Tech: n8n, vector database (RAG).
- Category: AI Automation. Status: Completed.
- Code: https://github.com/CodeWithNouman99/n8n-automation-projects

### P06 — Client Onboarding Automation
- Automated client onboarding workflow.
- Tech: n8n.
- Category: AI Automation. Status: Completed.
- Code: https://github.com/CodeWithNouman99/n8n-automation-projects

### P09 — HireHub
- Job portal frontend with Clerk authentication.
- Tech: React, Tailwind CSS, React Router, Clerk.
- Category: Frontend. Status: Completed.
- Code: https://github.com/CodeWithNouman99/Hire-Hub-Frontend
- Live demo: https://hire-hub-frontend.vercel.app

### P10 — Cartify
- E-commerce frontend.
- Tech: React.
- Category: Frontend. Status: Completed.
- Code: https://github.com/CodeWithNouman99/Cartify-React_Project
- Live demo: https://cartify-react-project.vercel.app

## Journey (timeline)
1. 2023 — Started Software Engineering: BS Software Engineering at the University of Agriculture Faisalabad.
2. 2025 — Frontend Foundations: learned JavaScript, React and Tailwind CSS; built HireHub and Cartify.
3. 2025 — Certified: Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate and Career Essentials in Software Development (Microsoft & LinkedIn Learning).
4. 2026 — Went Full-Stack: Node.js, Express and MongoDB (the MERN stack).
5. 2026 — AI Automation with n8n: WhatsApp booking bot, hospital RAG agent, client onboarding automation.
6. 2026 — TeamMatch AI: multi-agent system with MERN, n8n and RAG.
7. Now — Open to opportunities: freelance projects, and internships and junior roles at software houses.

## Services (what he offers teams)
1. Full-Stack Web Apps: MERN applications from idea to deployment: React frontends, Express APIs and MongoDB, with auth and clean responsive UI. Tech: React, Node.js, Express, MongoDB, Tailwind. Examples: Doctor Appointment Booking System (P08), HireHub (P09), Cartify (P10).
2. AI Automation with n8n: workflows that remove repetitive work: lead handling, bookings, onboarding, reminders and notifications across WhatsApp, Gmail, Sheets and Slack. Tech: n8n, Webhooks, Gmail, WhatsApp, Google Sheets. Examples: WhatsApp Doctor Appointment Bot (P05), Client Onboarding Automation (P06).
3. AI Chatbots & RAG Agents: assistants that answer from your own documents and data, using vector search and LLMs like Gemini. Tech: RAG, Pinecone, Gemini, AI Agents. Examples: Hospital RAG Agent (P07) and the chatbot on this portfolio.
4. Multi-Agent & Internal Tools: internal tools where AI agents do the heavy lifting: matching people to work, onboarding new developers, tracking progress. Tech: Multi-agent, MERN, n8n. Examples: TeamMatch AI (P03), DevBuddy (P01).

## Writing
- He publishes build logs on LinkedIn about his projects, including how he built TeamMatch AI, a WhatsApp appointment bot with n8n, and a hospital knowledge-base RAG agent.

## Job matching notes (used by the Job Fit Checker)
- Experience level: student and junior developer. No professional or company work experience is listed; all experience comes from his own projects.
- Seniority he is applying for: internships and junior roles.
- Where each skill is proven in projects:
  - React.js: HireHub (P09), Cartify (P10), and the MERN projects DevBuddy (P01), P03 and P08.
  - Tailwind CSS and React Router: HireHub (P09).
  - Authentication (Clerk): HireHub (P09).
  - Node.js, Express.js, MongoDB, REST APIs (MERN): DevBuddy (P01), TeamMatch AI (P03), Doctor Appointment Booking System (P08).
  - Role-based users (patients, doctors, admins): Doctor Appointment Booking System (P08).
  - n8n workflow automation: P01, P02, P03, P04, P05, P06, P07.
  - PostgreSQL: AI Job Hunter (P04), via Supabase only.
  - Next.js: no project. Basic familiarity only, so count it as a partial match, not as proven experience.
  - RAG and vector databases: TeamMatch AI (P03), AI Job Hunter (P04), Hospital RAG Agent (P07).
  - AI agents and multi-agent systems: TeamMatch AI (P03), WhatsApp Doctor Appointment Bot (P05).
  - WhatsApp AI agents: DevBuddy (P01), WhatsApp Doctor Appointment Bot (P05).
  - Voice AI agents (ElevenLabs) with webhook tools into n8n: TableTalk AI (P02).
  - Developer onboarding with AI: DevBuddy (P01), a MERN app with n8n workflows and a WhatsApp AI agent.
- The three certifications (Oracle AI Foundations, Microsoft & LinkedIn Career Essentials, Coursera Claude Code) are courses, not listed production experience.
- Any skill, language, framework or tool not written in this file is not part of his known skill set and counts as a gap (for example TypeScript, Redux, testing frameworks, Docker, AWS, Python or GraphQL are not listed).

## Not known (say you don't know and suggest emailing mrnoumannomi7@gmail.com)
- Freelance clients, testimonials and past client work (none are listed). When asked, say no client work is listed yet and point to his own projects.
- Specific freelance prices, rates or delivery times (only "pricing depends on scope" is known).
- Salary expectations, notice period, exact start date, relocation or remote preferences.
- Work experience at companies (none is listed).
- Live demo URLs for projects other than DevBuddy, TableTalk AI, Doctor Appointment Booking System, HireHub and Cartify.
- Anything personal not listed above.
