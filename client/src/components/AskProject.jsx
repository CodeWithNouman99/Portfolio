import { chat } from '../data/chat'
import { defaultAskQuestions } from '../data/projects'
import { openChat } from '../lib/openChat'

// Compact "Ask AI about this project" card: chips or a typed question open the floating chat,
// already sent and scoped to this project. The thin red border is a slowly rotating conic gradient.
export default function AskProject({ project, className = '' }) {
  const questions = project.askQuestions?.length ? project.askQuestions : defaultAskQuestions
  const ask = (question) => openChat({ question, projectSlug: project.slug })

  return (
    <div className={`rounded-xl border border-border bg-paper p-3.5 ${className}`}>
      <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-heading">
        <span aria-hidden="true" className="text-accent">✨</span>
        {chat.askProject.title}
      </p>
      <ul className="mt-2.5 flex flex-col gap-1">
        {questions.map((question) => (
          <li key={question}>
            <button
              type="button"
              onClick={() => ask(question)}
              className="group flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] text-secondary transition-colors hover:bg-surface hover:text-ink"
            >
              {question}
              <span aria-hidden="true" className="text-accent opacity-0 transition-opacity group-hover:opacity-100">→</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
