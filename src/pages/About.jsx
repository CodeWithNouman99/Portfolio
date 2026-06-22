const education = [
  {
    degree: "Bachelor of Science in Software Engineering",
    school: "University of Agriculture Faisalabad",
    year: "2023 – Present",
    icon: "🎓",
    CGPA:3.52
  },
];

const learning = [
  { item: "Advanced React patterns (custom hooks, context API)", icon: "⚛️" },
  { item: "REST API design and authentication with JWT", icon: "🔐" },
  { item: "MongoDB aggregation pipelines", icon: "🍃" },
  { item: "Deploying apps on Vercel & Render", icon: "☁️" },
  { item: "TypeScript fundamentals", icon: "🔷" },
];

const stats = [
  { label: "Projects Built", value: "3+" },
  { label: "Technologies", value: "8+" },
  { label: "Months Learning", value: "15+" },
  { label: "GitHub Repos", value: "10+" },
];

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-3">
            Get to Know Me
          </p>
          <h1 className="section-heading mb-4">
            About <span className="text-accent">Me</span>
          </h1>
          <div className="w-12 h-1 bg-accent rounded-full mx-auto" />
        </div>

        {/* Bio + stats */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 glass-card p-8 space-y-4">
            <h2 className="font-display font-bold text-2xl text-white">
              Hi, I'm Nouman Aslam 👋
            </h2>
            <p className="text-white/60 leading-relaxed">
             I’m a Front-end Developer from Faisalabad, Pakistan, focused on building responsive and user-friendly web applications with React. I’m currently expanding into full-stack development using Node.js, Express.js, and MongoDB through real-world projects.
            </p>
            <p className="text-white/60 leading-relaxed">
              I started programming with a deep curiosity about how modern web
              applications work — and that curiosity has driven me to build
              everything from e-commerce platforms to job portals. I love writing
              clean, efficient code and continuously improving through practice
              and feedback.
            </p>
            <p className="text-white/60 leading-relaxed">
              I'm currently seeking an{" "}
              <span className="text-accent font-medium">
                internship or junior developer role
              </span>{" "}
              where I can contribute to real projects, grow alongside experienced
              engineers, and make a meaningful impact.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 content-start">
            {stats.map(({ label, value }) => (
              <div
                key={label}
                className="glass-card p-5 text-center hover:-translate-y-1 transition-transform"
              >
                <p className="font-display font-extrabold text-3xl text-accent">
                  {value}
                </p>
                <p className="text-white/40 text-xs font-mono mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education, Goal, Currently Learning */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Education */}
          <div className="glass-card p-6">
            <h3 className="font-display font-bold text-lg text-white mb-5 flex items-center gap-2">
              <span className="text-xl">📚</span> Education
            </h3>
            {education.map(({ degree, school, year, CGPA,icon }) => (
              <div key={degree} className="border-l-2 border-accent/30 pl-4">
                <p className="text-xl mb-1">{icon}</p>
                <p className="font-medium text-white text-sm">{degree}</p>
                <p className="text-white/50 text-sm mt-1">{school}</p>
                <p className="text-accent font-mono text-xs mt-2">CGPA: {CGPA}/4.0</p>
                <p className="text-accent font-mono text-xs mt-2">{year}</p>
              </div>
            ))}
          </div>

          {/* Career Goal */}
          <div className="glass-card p-6 bg-accent/5 border-accent/20">
            <h3 className="font-display font-bold text-lg text-white mb-5 flex items-center gap-2">
              <span className="text-xl">🎯</span> Career Goal
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              My immediate goal is to land an{" "}
              <span className="text-accent font-medium">internship or junior developer</span>{" "}
              position where I can apply my Front-End skills on real products.
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              Long term, I aim to become a confident full-stack engineer who can
              architect scalable applications and lead development teams.
            </p>
          </div>

          {/* Currently learning */}
          <div className="glass-card p-6">
            <h3 className="font-display font-bold text-lg text-white mb-5 flex items-center gap-2">
              <span className="text-xl">⚡</span> Currently Learning
            </h3>
            <ul className="space-y-3">
              {learning.map(({ item, icon }) => (
                <li key={item} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="text-base shrink-0">{icon}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
