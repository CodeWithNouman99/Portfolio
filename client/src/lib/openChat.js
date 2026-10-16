// Opens the floating chat (ChatWidget listens for this event) from anywhere on the page.
// With a question it is sent right away; projectSlug scopes the answers to that project.
export function openChat({ question, projectSlug } = {}) {
  window.dispatchEvent(new CustomEvent('chat:open', { detail: { question, projectSlug } }))
}
