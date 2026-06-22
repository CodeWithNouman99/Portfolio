import { Link } from "react-router-dom";
import image2 from "../assets/image2.jpeg";
export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center w-full">
        {/* Left content */}
        <div className="space-y-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 glass-card text-sm text-accent font-mono"
            style={{ animation: "fadeUp 0.5s ease forwards" }}
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Open to Internships &amp; Junior Roles
          </div>

          <div style={{ animation: "fadeUp 0.5s 0.1s ease both" }}>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-accent-warm">
              Frontend Developer
            </p>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
              Hi, I’m <span className="text-accent">Nouman Aslam</span>
            </h1>
          </div>

          <div style={{ animation: "fadeUp 0.5s 0.2s ease both" }}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
              I create clean, responsive, and user-friendly web interfaces using
              React, Tailwind CSS, and modern frontend practices.
            </p>
          </div>

          <div style={{ animation: "fadeUp 0.5s 0.3s ease both" }}>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                JavaScript
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                Tailwind CSS
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                React.js
              </span>
            </div>
          </div>

          <div
            className="flex flex-wrap gap-4 pt-2"
            style={{ animation: "fadeUp 0.5s 0.4s ease both" }}
          >
            <Link to="/projects" className="btn-primary">
              View Projects →
            </Link>
            <a href="/Nouman%20Aslam%20Resume.pdf" download className="btn-outline">
              Download Resume
            </a>
          </div>

          {/* Social links */}
          <div
            className="flex items-center gap-4 pt-2"
            style={{ animation: "fadeUp 0.5s 0.5s ease both" }}
          >
            <span className="text-white/30 text-sm">Find me on</span>
            <a
              href="https://github.com/CodeWithNouman99"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-mono"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/nouman-aslam-a9a3a2333"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-mono"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>

        {/* Right — avatar */}
        <div
          className="flex justify-center md:justify-end"
          style={{ animation: "fadeIn 0.8s 0.2s ease both" }}
        >
          <div className="relative">
            {/* Rotating ring */}
            {/* <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent/20 animate-spin" style={{ animationDuration: "20s" }} />
            <div className="absolute -inset-4 rounded-full border border-white/5" /> */}

            {/* Avatar container */}
            {/* Right — avatar */}
            <div
              className="flex justify-center md:justify-end"
              style={{ animation: "fadeIn 0.8s 0.2s ease both" }}
            >
              <div className="relative">
                {/* Soft background glow */}
                <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-accent/20 via-accent-blue/10 to-transparent blur-2xl" />

                {/* Rotating ring */}
                <div
                  className="absolute -inset-3 rounded-[3rem] border border-dashed border-accent/20 animate-spin"
                  style={{ animationDuration: "20s" }}
                />

                {/* Avatar container */}
                <div className="relative h-64 w-64 md:h-80 md:w-80">
                  {/* Main image card */}
                  <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-ink shadow-2xl shadow-accent/10">
                    {/* Image */}
                    <div className="w-full h-full overflow-hidden flex items-center justify-center">
                      <img
                        src={image2}
                        alt="Nouman Aslam"
                        className="w-full h-full object-cover object-[60%_10%]"
                      />
                    </div>

                    {/* Bottom overlay only */}
                    <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                    {/* Bottom info card */}
                    <div className="absolute bottom-2 left-4 right-4 rounded-2xl border border-white/10 bg-black/35 p-3 text-center backdrop-blur-md">
                      <h3 className="font-display text-base font-semibold text-white">
                        Nouman Aslam
                      </h3>

                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                        Frontend Developer
                      </p>

                      <div className="mt-3 flex justify-center gap-2">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/80">
                          React
                        </span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/80">
                          Tailwind
                        </span>
                      </div>
                    </div>

                    {/* Small corner label */}
                    <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-medium text-white/70 backdrop-blur-md">
                      Available
                    </div>

                    {/* Overlay shimmer */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tech badges floating */}
            <div
              className="absolute -right-4 top-12 glass-card px-3 py-1.5 text-xs font-mono text-accent border-accent/20 animate-fade-up"
              style={{ animationDelay: "0.8s" }}
            >
              React.js ⚛️
            </div>
            <div
              className="absolute -left-6 bottom-12 glass-card px-3 py-1.5 text-xs font-mono text-green-400 border-green-500/20 animate-fade-up"
              style={{ animationDelay: "1s" }}
            >
              Node.js 🟢
            </div>
            <div
              className="absolute -right-2 bottom-4 glass-card px-3 py-1.5 text-xs font-mono text-accent-warm border-yellow-500/20 animate-fade-up"
              style={{ animationDelay: "1.2s" }}
            >
              MongoDB 🍃
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs font-mono animate-bounce">
        <span>scroll</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}
