import { useState } from "react";

const initialState = { name: "", email: "", subject: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm(initialState);
    }, 1200);
  };

  if (sent) {
    return (
      <div className="glass-card p-10 text-center space-y-4">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display font-bold text-xl text-white">Message Sent!</h3>
        <p className="text-white/50 text-sm">Thanks for reaching out. I'll get back to you soon.</p>
        <button
          onClick={() => setSent(false)}
          className="btn-outline text-sm mt-2"
        >
          Send Another
        </button>
      </div>
    );
  }

  const fields = [
    { name: "name", label: "Name", type: "text", placeholder: "Your full name" },
    { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
    { name: "subject", label: "Subject", type: "text", placeholder: "What's this about?" },
  ];

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-5">
      <h3 className="font-display font-bold text-xl text-white mb-6">Send a Message</h3>

      <div className="grid sm:grid-cols-2 gap-5">
        {fields.slice(0, 2).map(({ name, label, type, placeholder }) => (
          <div key={name}>
            <label className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-wider">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors ${
                errors[name] ? "border-red-500/50" : "border-white/10 hover:border-white/20 focus:border-accent/40"
              }`}
            />
            {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
          </div>
        ))}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-wider">Subject</label>
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="What's this about?"
          className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors ${
            errors.subject ? "border-red-500/50" : "border-white/10 hover:border-white/20 focus:border-accent/40"
          }`}
        />
        {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-wider">Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about the opportunity or project..."
          rows={5}
          className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors resize-none ${
            errors.message ? "border-red-500/50" : "border-white/10 hover:border-white/20 focus:border-accent/40"
          }`}
        />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : (
          <>
            Send Message
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
