const levelLabel = (level) => {
  if (level >= 85) return { text: "Advanced", color: "text-accent" };
  if (level >= 70) return { text: "Intermediate", color: "text-accent-blue" };
  return { text: "Learning", color: "text-accent-warm" };
};

const categoryColors = {
  Frontend: "border-accent/30 bg-accent/5",
  Backend: "border-green-400/30 bg-green-400/5",
  Database: "border-accent-blue/30 bg-accent-blue/5",
  Tools: "border-accent-pink/30 bg-accent-pink/5",
};

export default function SkillCard({ name, category, level, icon }) {
  const { text, color } = levelLabel(level);

  return (
    <div className="glass-card p-5 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group cursor-default">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-display font-semibold text-white text-sm">{name}</h3>
            <span
              className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-mono rounded-md border ${
                categoryColors[category] || "border-white/10 bg-white/5"
              } text-white/60`}
            >
              {category}
            </span>
          </div>
        </div>
        <span className={`text-xs font-mono font-medium ${color}`}>{level}%</span>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 group-hover:opacity-90"
            style={{
              width: `${level}%`,
              background:
                level >= 85
                  ? "linear-gradient(90deg, #6EE7B7, #34d399)"
                  : level >= 70
                  ? "linear-gradient(90deg, #60A5FA, #818cf8)"
                  : "linear-gradient(90deg, #FCD34D, #fb923c)",
            }}
          />
        </div>
        <p className={`mt-2 text-xs font-mono ${color}`}>{text}</p>
      </div>
    </div>
  );
}
