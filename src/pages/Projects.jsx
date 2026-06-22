import projects from "../data/projects";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-3">
            Portfolio
          </p>
          <h1 className="section-heading mb-4">
            My <span className="text-accent">Projects</span>
          </h1>
          <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
            Here are some projects I've built while learning and practicing web
            development with the Front-End Development.
          </p>
          <div className="w-12 h-1 bg-accent rounded-full mx-auto mt-6" />
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center glass-card p-10 bg-accent/5 border-accent/20">
          <p className="font-display font-bold text-2xl text-white mb-2">
            More projects coming soon 
          </p>
          <p className="text-white/50 text-sm mb-6">
            I'm constantly building and learning. Check my GitHub for the latest updates.
          </p>
          <a
            href="https://github.com/CodeWithNouman99"
            target="_blank"
            rel="noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            View GitHub Profile
          </a>
        </div>
      </div>
    </div>
  );
}
