import ContactForm from "../components/ContactForm";

const contactInfo = [
  {
    icon: "📧",
    label: "Email",
    value: "mrnoumannomi7@gmail.com",
    href: "mrnoumannomi7@gmail.com",
  },
  {
    icon: "🐙",
    label: "GitHub",
    value: "https://github.com/CodeWithNouman99",
    href: "https://github.com/CodeWithNouman99",
  },
  {
    icon: "💼",
    label: "LinkedIn",
    value: "linkedin.com/in/nouman-aslam-a9a3a2333",
    href: "linkedin.com/in/nouman-aslam-a9a3a2333",
  },
  {
    icon: "📍",
    label: "Location",
    value: "Faisalabad, Pakistan",
    href: null,
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="font-mono text-accent text-sm tracking-widest uppercase mb-3">
            Let's Talk
          </p>
          <h1 className="section-heading mb-4">
            Contact <span className="text-accent">Me</span>
          </h1>
          <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
            I'm open to internship and junior developer opportunities. Whether
            you have a question or a project in mind — let's connect!
          </p>
          <div className="w-12 h-1 bg-accent rounded-full mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="glass-card p-8">
              <h2 className="font-display font-bold text-xl text-white mb-6">
                Get in Touch
              </h2>
              <div className="space-y-5">
                {contactInfo.map(({ icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="text-xs font-mono text-white/30 uppercase tracking-wider mb-0.5">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                          className="text-white/80 text-sm hover:text-accent transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-white/80 text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability badge */}
            <div className="glass-card p-6 bg-accent/5 border-accent/20">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                <p className="font-display font-semibold text-accent text-sm">
                  Available for Hire
                </p>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                I'm currently looking for internship and junior developer roles.
                Open to full-time, part-time, and remote opportunities.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
