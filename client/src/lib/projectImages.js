import { projects } from '../data/projects'

// Every image in src/assets/projects/, bundled at build time.
//   <slug>.<ext>                 → the project's main image (e.g. teammatch-ai.png)
//   <slug>-2.<ext>, <slug>-3 …   → gallery images for the case study page, in number order
const files = import.meta.glob('../assets/projects/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
})

// If the same name exists in several formats, prefer the lighter modern ones
const FORMAT_RANK = { avif: 0, webp: 1, png: 2, jpg: 3, jpeg: 3 }

const byName = {}
for (const [path, src] of Object.entries(files)) {
  const file = path.split('/').pop()
  const dot = file.lastIndexOf('.')
  const name = file.slice(0, dot).toLowerCase()
  const ext = file.slice(dot + 1).toLowerCase()
  if (!byName[name] || FORMAT_RANK[ext] < byName[name].rank) byName[name] = { src, rank: FORMAT_RANK[ext] }
}

// project → main image URL, or null (callers show the dark gradient fallback)
export function projectImage(project) {
  return project.image ?? byName[project.slug]?.src ?? null
}

// project → gallery image URLs (<slug>-2, <slug>-3 …), sorted by number
export function projectGallery(project) {
  const pattern = new RegExp(`^${project.slug}-(\\d+)$`)
  return Object.entries(byName)
    .map(([name, { src }]) => [Number(name.match(pattern)?.[1]), src])
    .filter(([n]) => n >= 2)
    .sort(([a], [b]) => a - b)
    .map(([, src]) => src)
}

// Development help: flag files that belong to no project (usually a typo in the file name)
if (import.meta.env.DEV) {
  const slugs = projects.map((p) => p.slug)
  const orphans = Object.keys(byName).filter((name) => !slugs.some((s) => name === s || new RegExp(`^${s}-\\d+$`).test(name)))
  if (orphans.length) {
    console.warn(
      `[projects] Images that match no project slug: ${orphans.join(', ')}. Name them <slug> or <slug>-2, <slug>-3 … (slugs: ${slugs.join(', ')})`,
    )
  }
}
