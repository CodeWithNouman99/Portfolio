import Hero from "../components/Hero";
import AiAssistant from "../components/AiAssistant";

const reasons = [
  {
    icon: "⚛️",
    title: "Frontend Development",
    desc: "I craft responsive, accessible UIs with React.js and Tailwind CSS, focusing on great user experience across all devices.",
    color: "border-accent/20 hover:border-accent/40",
    glow: "bg-accent/5",
  },
 {
  icon: "🚀",
  title: "Backend Development (Learning)",
  desc: "Currently learning REST APIs with Node.js and Express.js and exploring MongoDB for building scalable backend systems.",
  color: "border-blue-400/20 hover:border-blue-400/40",
  glow: "bg-blue-400/5",
},
  {
    icon: "🧩",
    title: "Problem Solving",
    desc: "I enjoy breaking complex problems into manageable pieces and delivering clean, efficient solutions with readable code.",
    color: "border-yellow-400/20 hover:border-yellow-400/40",
    glow: "bg-yellow-400/5",
  },
];

export default function Home() {
  return (
    <div>
      <Hero />

      {/* Why Hire Me */}
      <section className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="font-mono text-accent text-sm tracking-widest uppercase mb-3">
              Why Hire Me?
            </p>
            <h2 className="section-heading">
              What I Bring to the{" "}
              <span className="text-accent">Table</span>
            </h2>
            <p className="text-white/50 mt-4 max-w-xl mx-auto leading-relaxed">
              As a self-driven Front-end developer, I combine technical skills
              with a strong work ethic and eagerness to learn.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {reasons.map(({ icon, title, desc, color, glow }) => (
              <div
                key={title}
                className={`glass-card ${glow} border ${color} p-8 hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-200">
                  {icon}
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-3">
                  {title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant */}
      <section className="py-24 relative border-t border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="font-mono text-accent text-sm tracking-widest uppercase mb-3">
              Interactive
            </p>
            <h2 className="section-heading">
              Ask My <span className="text-accent">AI Assistant</span>
            </h2>
            <p className="text-white/50 mt-4 max-w-xl mx-auto leading-relaxed">
              Have questions about my skills or projects? My AI assistant is here to help recruiters and collaborators learn more about me instantly.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <AiAssistant />
          </div>
        </div>
      </section>
    </div>
  );
}
