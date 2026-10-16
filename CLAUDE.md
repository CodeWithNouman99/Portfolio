# Nouman Aslam — Portfolio v2 (project brief for Claude Code)

Read this file fully before every task. It is the single source of truth for design, content and structure.

## Rules
- Build ONE section/feature per task. Do not jump ahead to sections that were not asked for.
- Visual reference: https://www.armghan.me/ — match its layout, typography, colours, spacing, motion and chat widget ~95%.
- Content must be Nouman's own (from `client/src/data/`). Never copy text, photos or names from the reference site.
- Never invent numbers, dates, links or testimonials. If data is missing, leave a `// TODO:` and tell me.
- Keep all content in `client/src/data/*.js` files, not hard-coded in components.
- Mobile-first and fully responsive (375px → 1440px). No horizontal page scroll.
- After each task: run the dev server, check for console errors, and summarise what changed in 3–5 lines.

## Tech stack
- `client/`: React 18 + Vite + Tailwind CSS v3 + Framer Motion + React Router + lucide-react icons
- `server/`: Node.js + Express + MongoDB (Mongoose) + Google Gemini API (`@google/generative-ai`)
- Env vars only in `.env` files (never commit them). Provide `.env.example`.

## Design tokens (measured from the reference site)
| Token | Value | Use |
|---|---|---|
| Font | **Space Grotesk** (Google Fonts, 400/500/700/800/900) | everything |
| Background | `#FFFFFF` | page |
| Surface muted | `#F5F5F5` / `#F9F9F9` | pills, cards hover |
| Text primary | `#171717` (headings `#111111`) | body + headings |
| Text secondary | `rgba(0,0,0,0.52)` | paragraphs |
| Text muted | `rgba(0,0,0,0.38)` | small labels, eyebrow |
| Grey | `#737373` | meta text |
| Border | `#E6E6E6` | cards, dividers |
| Accent | **`#FF3131`** (also 20% / 30% alpha) | eyebrow labels, active nav, CTA, numbers, dots |
| Dark | `#111111` / `#000000` | marquee bar, dark buttons, floating tags |
| Radius | `0.375rem` cards; pills fully rounded | |

Type scale:
- Eyebrow label: 12px, weight 700, letter-spacing 2.4px, UPPERCASE, accent red (e.g. "ABOUT ME").
- Hero kicker "HY! I AM": 14px, 700, letter-spacing 2.5px, muted.
- Hero name: ~72–96px desktop (48px mobile), weight 800, letter-spacing -0.03em, line-height 1.05, two lines (first / last name).
- Section H2: 32px mobile → 56px desktop, weight 700.
- Body: 14–16px, line-height 1.8, secondary colour.
- Stat number: 24–32px weight 900; stat label 10px, 700, letter-spacing 1px, muted.
- Marquee text: 12px, 700, letter-spacing 1.8px, white on black.

Signature effects:
- **Giant watermark word** behind every section heading (e.g. "ABOUT", "CAREER", "WRITING", "CONNECT"; hero uses "NOUMAN"): ~200–260px, weight 800, colour `#000` at ~4% opacity, absolutely positioned, `select-none`, `pointer-events-none`.
- Soft grey **wave/mesh texture** background at bottom of hero and contact (SVG or subtle image, low opacity).
- Fade-up on scroll for headings/cards (Framer Motion, 0.5s, y: 24 → 0, once).
- Black-and-white images with a **red duotone overlay** on hover/feature tiles.

## Page structure (single page, in this order)
1. **Navbar** — logo `nouman.` (the dot in accent red) on left; centered pill nav (light grey `#F5F5F5` rounded-full, items: Home, Services, Projects, Certifications, Contact; active item text red); right: LinkedIn + GitHub icon links. Sticky, white with slight blur, bottom border on scroll. Mobile: hamburger → full-screen menu.
2. **Hero** — 3 columns on desktop:
   - Left: "HY! I AM" kicker, two-line name "Nouman / Aslam", tagline, 4 red-dot bullets, buttons: red "Get In Touch ↗" + text "Download CV ↗", "Find me on:" with round icon buttons (mail, LinkedIn, GitHub).
   - Center: Nouman's cut-out photo standing in front of a big **red arch** (semi-circle top), with 4 small black floating pill tags around it (slow float animation).
   - Right: white "stats card" (border, small shadow) with eyebrow "IMPACT", 3 stats in a row, one line under it, and a round black "LET'S TALK →" button; below it a short paragraph.
   - Watermark "NOUMAN" behind everything; wave texture at bottom.
3. **Skill marquee** — full-width black bar, infinite horizontal scroll of skills separated by red ▸ / dots.
4. **Tech marquee** — light row: bold label "TECH I SHIP WITH" + scrolling grey pills (React, Node.js, Express, MongoDB, Tailwind, n8n, Gemini, RAG, Git, Vercel…).
5. **About** — eyebrow "ABOUT ME", H2 "Who I Am" + right-aligned one-liner, watermark "ABOUT". Then a 2×2 zig-zag grid: image tile (B&W photo, red gradient, big white heading inside) next to a text card; alternate sides. 4 blocks: "Who Am I?", "What I Build", "How I Work", "Where I'm Going".
5b. **Services** (id `services`, after About) — eyebrow "WHAT I DO", H2 "How I can help your team", watermark "SERVICES"; light "feature tour": service list on the left (red bar + 6s progress line on the active one; pill tabs on mobile), one card on the right with the animated SVG illustration, description, chips and project links. Auto-advances every 6s, pauses on hover/click. Content in `client/src/data/services.js`.
6. **Projects** (new section, same visual language as the reference "Recent Publications" list): eyebrow "WORK", H2 "Selected Projects", filter pills (All / Full-Stack / AI Automation / Frontend). Numbered rows (`P01`, `P02` in red), title, one-line description, tech tags, status badge (Completed = black, In Progress = red outline), GitHub + Live buttons. Sticky dark image card on the right on desktop. Clicking a flagship opens `/projects/:slug` case-study page.
7. **Career Timeline** — eyebrow "EXPERIENCE", H2 "My Journey", watermark "JOURNEY". Pinned **horizontal scroll** section (vertical scroll moves cards horizontally), each card: big red number `01`, year as giant watermark, B&W image, title + subtitle.
8. **Build Logs** (currently hidden: removed from the page and navbar, files kept; replaces reference "Blog") — eyebrow "WRITING", H2 "Build Logs", watermark "LOGS"; first post as a large horizontal card (image left, text right, red category label, date, "See Details →"), others in a grid.
9. **Certifications** (styled like reference "Publications") — numbered list rows with issuer, year, "Verify ↗" link; side card with total count.
10. **Contact** — eyebrow "LET'S CONNECT", H2 "Get In Touch", watermark "CONNECT", subtitle, contact form (name, email, company, message) + two buttons (black filled email, white outlined LinkedIn). Wave texture background.
11. **Footer** — social icons left, "Personal portfolio / 2026" center, "© 2026 Nouman Aslam. All rights reserved." right.
12. **Floating AI chat** (global, bottom-right on every page): round avatar button (cartoon/illustrated avatar of Nouman) + white speech bubble "Ask me about Nouman 👋". Click → white card panel (~360px) with small grey "Chat" chip, title "Ask me about Nouman", close ✕, bot message bubble in light grey, input "Ask about projects, skills or availability…" and red "Send" button. Answers come from `server` (`POST /api/chat`) using Gemini + Nouman's data as context.

## Nouman's content (source data)
- Name: Nouman Aslam · Faisalabad, Pakistan
- Role: MERN Stack Developer & AI Automation Builder · Open to internships & junior roles
- Tagline: "Code that ships, not just compiles."
- Education: BS Software Engineering, University of Agriculture Faisalabad (2023 – present), CGPA 3.52/4.0
- Certifications: Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate (Oracle University, 2025, valid until Aug 2027); Career Essentials in Software Development (Microsoft & LinkedIn Learning, Mar 2025, Learning Path; skills: Programming, Software Development) — TODO: verify links
- Stack: React.js, JavaScript (ES6+), Tailwind CSS, Context API, Node.js, Express.js, MongoDB, REST APIs, n8n, Gemini, RAG / vector DBs, Git, Oracle SQL
- Links: GitHub https://github.com/CodeWithNouman99 · LinkedIn https://www.linkedin.com/in/nouman-aslam-a9a3a2333 · Email mrnoumannomi7@gmail.com

Projects (status — category):
| # | Project | Category | Status | Repo |
|---|---|---|---|---|
| P01 | TeamMatch AI — multi-agent system that matches a software house's developers to client requests (MERN + n8n + RAG) | Full-Stack + AI | Completed | teammatch-ai |
| P02 | Doctor Appointment Booking System — patients book, doctors manage schedules, admins oversee (MERN) | Full-Stack | **In Progress** | doctor-appointment-system-mern |
| P03 | DevBuddy — AI onboarding buddy for new developers at software houses | Full-Stack + AI | Completed | devbuddy-portal |
| P04 | WhatsApp Doctor Appointment Bot — AI agent books, reschedules, cancels (n8n) | AI Automation | Completed | n8n-automation-projects |
| P05 | Hospital RAG Agent — answers hospital questions from a knowledge-base PDF (n8n + vector DB) | AI Automation | Completed | n8n-automation-projects |
| P06 | Client Onboarding Automation (n8n) | AI Automation | Completed | n8n-automation-projects |
| P07 | HireHub — job portal with Clerk auth (React + Tailwind + React Router) | Frontend | Completed | Hire-Hub-Frontend |
| P08 | Cartify — e-commerce frontend (React) | Frontend | Completed | Cartify-React_Project |

TODO (Nouman will provide): live URLs, screenshots, CV PDF, hero cut-out photo (PNG, transparent), cartoon avatar for chat, real stat numbers, timeline years, build-log posts.

## Folder structure
```
nouman-portfolio/
├── CLAUDE.md
├── client/   (Vite React app)
│   └── src/{components,sections,pages,data,hooks,assets}
└── server/   (Express API: /api/chat, /api/contact)
```