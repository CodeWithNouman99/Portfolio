// Soft grey line-mesh used at the bottom of the hero and contact sections.
const LINES = 28

function wavePath(i) {
  const base = 60 + i * 9
  const amp = 18 + i * 1.2
  const phase = i * 0.18
  const points = []
  for (let x = 0; x <= 1440; x += 30) {
    const t = x / 1440
    const y = base + amp * Math.sin(t * Math.PI * 2 + phase) * Math.cos(t * Math.PI)
    points.push(`${x},${y.toFixed(1)}`)
  }
  return `M ${points.join(' L ')}`
}

export default function WaveTexture({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 select-none ${className}`}
      style={{
        maskImage: 'linear-gradient(to bottom, transparent, black 45%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 45%)',
      }}
    >
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="h-full w-full stroke-ink"
        fill="none"
      >
        {Array.from({ length: LINES }, (_, i) => (
          <path
            key={i}
            d={wavePath(i)}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            strokeOpacity={0.05 + (i / LINES) * 0.05}
          />
        ))}
      </svg>
    </div>
  )
}
