import skills from "../data/skills";
import SkillCard from "../components/SkillCard";

const categories = ["Frontend", "Backend", "Database", "Tools"];

const categoryMeta = {
  Frontend: {
    icon: "🎨",
    desc: "Building responsive and modern React-based user interfaces",
  },
  Backend: {
    icon: "⚙️",
    desc: "Currently learning server-side development and REST APIs",
  },
  Database: {
    icon: "🗄️",
    desc: "Managing and querying data efficiently",
  },
  Tools: {
    icon: "🛠️",
    desc: "Development tools and workflow setup",
  },
};

export default function Skills() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-3">
            Expertise
          </p>

          <h1 className="section-heading mb-4">
            My <span className="text-accent">Skills</span>
          </h1>

          <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
            Technologies and tools I use to build responsive frontend web
            applications, while gradually expanding into backend development.
          </p>

          <div className="w-12 h-1 bg-accent rounded-full mx-auto mt-6" />
        </div>

        {/* Categories */}
        <div className="space-y-14">
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            const meta = categoryMeta[cat] || {};

            return (
              <div key={cat}>
                
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{meta.icon || "📌"}</span>

                  <div>
                    <h2 className="font-display font-bold text-xl text-white">
                      {cat}
                    </h2>
                    <p className="text-white/40 text-sm">
                      {meta.desc || ""}
                    </p>
                  </div>

                  <div className="flex-1 h-px bg-white/10 ml-4" />

                  <span className="text-xs font-mono text-white/30">
                    {catSkills.length} skills
                  </span>
                </div>

                {/* Skills Grid */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {catSkills.map((skill) => (
                    <SkillCard key={skill.id} {...skill} />
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}