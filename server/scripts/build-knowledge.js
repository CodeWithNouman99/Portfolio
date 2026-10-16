// Writes knowledge/projects.md from the client's project data (client/src/data/projects.js and
// architecture.js), so the chat assistant knows everything the project pages show.
// Run after editing those files: npm run knowledge (also runs before npm run dev).
// The output is committed, so a server deployed without the client folder still has it.
import { writeFileSync } from 'node:fs'
import { projects } from '../../client/src/data/projects.js'
import { architecture } from '../../client/src/data/architecture.js'

const filled = (value) => typeof value === 'string' && value.trim().length > 0
const OUT = new URL('../knowledge/projects.md', import.meta.url)

function architectureLines(system) {
  const label = (id) => system.nodes.find((n) => n.id === id).label
  const lines = ['- Architecture (the "How it works" diagram on the page):']
  if (filled(system.note)) lines.push(`  - Note: ${system.note}`)
  for (const [from, to, kind] of system.edges) {
    lines.push(`  - ${label(from)} ${kind === 'tool' ? 'uses the tool' : '→'} ${label(to)}`)
  }
  lines.push('  - What each step does:')
  for (const node of system.nodes) lines.push(`    - ${node.label} (${node.tag}): ${node.note}`)
  return lines
}

function projectSection(p) {
  const lines = [`### ${p.title} · ${p.id} · page /projects/${p.slug}`]
  if (filled(p.short)) lines.push(`- Description: ${p.short}`)
  lines.push(`- Category: ${p.category.join(', ')}. Status: ${p.status}.`)
  if (p.tech?.length) lines.push(`- Tech: ${p.tech.join(', ')}.`)
  lines.push(`- Code: ${p.github}`)
  lines.push(p.live ? `- Live demo: ${p.live}` : '- Live demo: none yet.')
  if (p.summary) {
    if (filled(p.summary.problem)) lines.push(`- Problem (summary card): ${p.summary.problem}`)
    if (filled(p.summary.solution)) lines.push(`- Solution (summary card): ${p.summary.solution}`)
    if (filled(p.summary.result)) lines.push(`- Result (summary card): ${p.summary.result}`)
  }
  if (filled(p.overview)) lines.push(`- Overview: ${p.overview}`)
  if (filled(p.problem)) lines.push(`- The problem: ${p.problem}`)
  const steps = Array.isArray(p.howItWorks) ? p.howItWorks.filter(filled) : []
  if (steps.length) {
    lines.push('- How it works:')
    steps.forEach((step, i) => lines.push(`  ${i + 1}. ${step}`))
  }
  if (filled(p.challenges)) lines.push(`- Challenges: ${p.challenges}`)
  if (filled(p.results)) lines.push(`- Results: ${p.results}`)
  if (architecture[p.slug]) lines.push(...architectureLines(architecture[p.slug]))
  return lines.join('\n')
}

const md = `## Project page details (generated from the portfolio's project data; do not edit by hand)
Fields not listed for a project are not written yet, so they are not known.

${projects.map(projectSection).join('\n\n')}
`

writeFileSync(OUT, md)
console.log(`[knowledge] wrote knowledge/projects.md (${projects.length} projects)`)
