// Project status pill: "Completed" = black, "In Progress" = red outline with a live dot
export default function StatusBadge({ status }) {
  if (status === 'In Progress') {
    return (
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1px] text-accent">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        {status}
      </span>
    )
  }
  return (
    <span className="inline-flex whitespace-nowrap rounded-full bg-dark px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1px] text-white">
      {status}
    </span>
  )
}
