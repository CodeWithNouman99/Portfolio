# Progress: Chatbot upgrade

Built on 2026-10-15 while you were away. Nothing is committed to git. All facts about you come only from
`CLAUDE.md`, `client/src/data/` and `server/knowledge/nouman.md`. Of the three phases, only the chatbot
upgrade (Phase 1) remains: Audience Mode (Phase 2) and the Multi-Agent Playground (Phase 3) were
removed at your request.

> **Restart your API server after pulling these changes** (`server/`, `npm run dev`). The `/api/chat`
> reply format (`{ reply, projects }`) only exists after a restart. I tested on throwaway instances
> on other ports and stopped them afterwards; your servers were not touched.

> **Gemini quota warning.** Your API key is on the **free tier: 20 requests per day for
> `gemini-3.8-flash`**. It ran out during testing (`429 … generate_content_free_tier_requests,
> limit: 20`). When it's used up, chat depends on the fallback `gemini-3.6-flash`, which was also
> returning `503 high demand` that day. Each chat message uses 1 request, so on the free tier the live
> site can only serve a handful of conversations per day. Consider enabling billing on the key.

---

## Phase 1: Chatbot upgrade

### Built
- **a) Formatting:** already in place before this task. `ChatWidget.jsx` renders `**bold**` and line
  breaks as React elements (no `dangerouslySetInnerHTML`, no libraries), and the server prompt already
  asked for short plain replies with at most one bold project name. Kept as is.
- **b) Project cards:** `/api/chat` now uses Gemini JSON mode and returns `{ reply, projects: ["P01", …] }`.
  The server keeps only ids that exist in `nouman.md`, removes duplicates and caps the list at 2.
  Under a bot reply, the widget shows small cards (red id + title + "View →"). Clicking one closes the
  chat and scrolls to that project row, switching the filter to "All" and briefly highlighting the row.
  From a case-study page it goes to `/#project-P0x`.
- **c) Multilingual:** the prompt makes the bot reply in the user's language (English, Roman Urdu,
  Urdu script, Arabic) with the same facts, keeping project/tech names, links and the email in English.
  Bubbles use `dir="auto"`, so Urdu/Arabic render right-to-left.
- **d) Voice:** a mic button in the input row (Web Speech API, speech-to-text fills the input) and a
  speaker toggle in the header (reads bot replies aloud with `speechSynthesis`). Each control is
  hidden when the browser doesn't support it (e.g. no mic button in Firefox). Closing the chat stops
  both.

### Files
`server/src/services/gemini.js` (shared `generate()` helper with timeout + one fallback retry, JSON chat),
`server/src/routes/chat.js`, `client/src/components/ChatWidget.jsx`, `client/src/hooks/useSpeech.js` (new),
`client/src/lib/focusProject.js` (new), `client/src/lib/api.js`, `client/src/data/chat.js`,
`client/src/sections/Projects.jsx` (row ids `project-P01…` + `project:focus` listener).

### Verified
- Real Gemini calls: Roman Urdu and Arabic answers came back in those languages; Urdu-script and
  English project questions returned `projects: ["P01","P04"]`, `["P01","P03"]`, `["P01"]`;
  non-project questions returned `[]`.
- In the browser: `<strong>` rendering, 2 project cards, clicking a card closes the chat and scrolls
  to and highlights the row, mic and speaker buttons show in Chrome, no console errors.

### Not verified
- **Voice was not exercised end to end.** The mic needs a microphone permission prompt and speech
  output plays audio on your machine, so I only checked that the controls appear and are wired.
  The recognition language follows your browser language (`navigator.language`), so with an English
  browser, spoken Urdu may be transcribed poorly. A language picker would fix that if needed.

---

## Phase 2: Audience Mode (removed)

Built, then **removed at your request** on 2026-10-15. The toggle, `data/audience.js`, the audience
context/hook/provider, the sessionStorage code and the `FadeText` component are all deleted. The
Hero shows the original tagline and 4 bullets from `profile.js` again, and Projects uses each
project's original `short` line from `projects.js`.

---

## Phase 3: Multi-Agent Playground (removed)

Built, then **removed at your request** on 2026-10-15. Deleted:
- Client: the "LIVE DEMO" band after Projects (`sections/AgentsCta.jsx`), the agents modal
  (`components/AgentsModal.jsx`), the generic `components/Modal.jsx` (only the agents modal used it),
  `data/agentsDemo.js`, and `streamAgents()` from `lib/api.js`.
- Server: the `/api/agents` route and its rate limiter (`routes/agents.js`), `services/agents.js`,
  `server/data/demoTeam.json` (the now-empty `server/data/` folder too), and the agents-only
  `generateJson()` / `geminiConfigured` exports in `services/gemini.js`.

Kept, because the chatbot uses them: the shared `generate()` helper in `gemini.js`,
`lib/focusProject.js`, and the project row ids + `project:focus` listener in `Projects.jsx`.

---

## How to test

1. Restart your API server (`cd server && npm run dev`) and keep Vite running (`cd client && npm run dev`).
   Make sure Gemini quota is available (resets daily on the free tier).
2. **Chat:** open the bubble, then:
   - Ask "What has he built with n8n?" and expect a reply plus 1–2 project cards. Click one: the chat
     closes, the page scrolls to the row and it flashes.
   - Ask in Roman Urdu ("Kya Nouman internship ke liye available hai?"), Urdu script, and Arabic.
   - In Chrome/Edge: click the mic, allow access, speak; the input fills. Turn on the speaker icon and
     send a message; the reply is read aloud. In Firefox the mic button is hidden.
3. `cd client && npx oxlint src && npm run build`: both pass as of this write-up.

## Other notes
- **Console errors during my session came from Vite hot reload, not the code.** They happened when it
  picked up a file between two of my edits (e.g. "description is not defined"). After a reload the
  console was clean for every phase.
- `fetchWithTimeout` in `server/src/lib/http.js` is unused since the n8n change (left in, as you asked
  last time).
