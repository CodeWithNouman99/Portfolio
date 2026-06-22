import { useState, useRef, useEffect } from "react";
import image2 from "../assets/image2.jpeg"
const BOT_NAME = "Nouman's AI Assistant";

const qa = [
  {
    keywords: ["skill", "know", "tech", "stack", "language"],
    answer:
      "Nouman is skilled in the Front-end Development — React.js. He also knows HTML, CSS, JavaScript, Tailwind CSS, Git, and GitHub.Currently learning REST APIs with Node.js and Express.js and exploring MongoDB for building scalable backend systems.",
  },
  {
    keywords: ["project", "built", "made", "work", "portfolio"],
    answer:
      "Nouman has built 3 notable projects: Cartify (e-commerce platform), HireHub (job portal), a Portfolio Website. Check the Projects page for details!",
  },
  {
    keywords: ["intern", "available", "hire", "job", "opportun", "junior"],
    answer:
      "Yes! Nouman is actively looking for internship opportunities and junior developer roles. He's based in Faisalabad, Pakistan and open to remote work too. Feel free to reach out via the Contact page.",
  },
  {
    keywords: ["react", "frontend"],
    answer:
      "Nouman works with React.js for building modern, component-based UIs. He pairs it with Tailwind CSS and React Router DOM for styling and navigation.",
  },
  {
    keywords: ["node", "express", "backend", "server", "api"],
    answer:
      "For backend, Nouman uses Node.js and Express.js to build REST APIs. He handles authentication with JWT and connects to MongoDB for data storage.",
  },
  {
    keywords: ["mongodb", "database", "db"],
    answer:
      "Nouman uses MongoDB as his primary database — working with it through Mongoose ODM to model data and handle CRUD operations.",
  },
  {
    keywords: ["education", "study", "degree", "university", "college"],
    answer:
      "Nouman is currently pursuing a degree in Computer Science while simultaneously building real-world projects to strengthen his practical skills.",
  },
  {
    keywords: ["contact", "email", "reach", "connect", "linkedin"],
    answer:
      "You can reach Nouman via the Contact page on this website, through his GitHub (github.com/noumandev), or on LinkedIn (linkedin.com/in/noumandev).",
  },
  {
    keywords: ["location", "where", "city", "country", "pakistan"],
    answer:
      "Nouman is based in Faisalabad, Pakistan. He's open to remote opportunities and is comfortable working across different time zones.",
  },
  {
    keywords: ["hello", "hi", "hey", "greet"],
    answer:
      "Hey there! 👋 I'm Nouman's AI assistant. Ask me anything about his skills, projects, or availability for hire!",
  },
];

const fallback =
  "Great question! I don't have a specific answer for that yet. You can explore the website or send Nouman a message directly via the Contact page.";

function getAnswer(input) {
  const lower = input.toLowerCase();
  for (const { keywords, answer } of qa) {
    if (keywords.some((k) => lower.includes(k))) return answer;
  }
  return fallback;
}

const suggestions = [
  "What skills does Nouman have?",
  "Is Nouman available for internship?",
  "What projects has he built?",
  "How can I contact him?",
];

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! 👋 I'm Nouman's AI portfolio assistant. Ask me about his skills, projects, or availability!",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userText }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "bot", text: getAnswer(userText) }]);
    }, 800 + Math.random() * 400);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="glass-card overflow-hidden flex flex-col" style={{ height: "480px" }}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center overflow-hidden">
            <img
              src={image2}
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-ink" />
        </div>
        <div>
          <p className="font-display font-semibold text-sm text-white">{BOT_NAME}</p>
          <p className="text-xs text-accent font-mono">● Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs md:max-w-sm text-sm rounded-2xl px-4 py-2.5 leading-relaxed ${msg.role === "user"
                ? "bg-accent text-ink font-medium rounded-br-sm"
                : "bg-white/10 text-white/80 rounded-bl-sm"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="shrink-0 text-xs px-3 py-1.5 glass-card border-accent/20 text-accent/80 hover:text-accent hover:border-accent/40 rounded-full transition-all whitespace-nowrap"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask something..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent/40 transition-colors"
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || typing}
          className="w-10 h-10 flex items-center justify-center bg-accent text-ink rounded-xl hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
