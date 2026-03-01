import { Reveal } from "./Reveal";

const features = [
  {
    icon: "🌐",
    title: "Auto-Trained on Your Website",
    description: "Kufu crawls your website and trains your chatbot automatically. No manual data entry, no file uploads — just point it at your URL.",
    accent: "#3b82f6",
    border: "rgba(59,130,246,0.18)",
    glow: "rgba(59,130,246,0.06)",
  },
  {
    icon: "📚",
    title: "Custom Knowledge Base",
    description: "Add your own FAQs, pricing details, policies, and more directly from your dashboard. The more you teach it, the smarter it gets.",
    accent: "#6366f1",
    border: "rgba(99,102,241,0.18)",
    glow: "rgba(99,102,241,0.06)",
  },
  {
    icon: "⚡",
    title: "Instant One-Tag Setup",
    description: "Add one script tag to your website and your AI chatbot goes live immediately — on any platform, any framework, no developer needed.",
    accent: "#8b5cf6",
    border: "rgba(139,92,246,0.18)",
    glow: "rgba(139,92,246,0.06)",
  },
  {
    icon: "🔄",
    title: "Always Up to Date",
    description: "Re-sync your website anytime your content changes. Your chatbot stays current with one click — no rebuilding, no retraining from scratch.",
    accent: "#06b6d4",
    border: "rgba(6,182,212,0.18)",
    glow: "rgba(6,182,212,0.06)",
  },
  {
    icon: "🛡️",
    title: "Domain Protection",
    description: "Lock your chatbot to your domain only. Your widget key is protected — no one else can embed your chatbot on their website.",
    accent: "#3b82f6",
    border: "rgba(59,130,246,0.18)",
    glow: "rgba(59,130,246,0.06)",
  },
  {
    icon: "💬",
    title: "Answers Like You Would",
    description: "Your chatbot knows your services, pricing, FAQs, and more — and responds naturally, like a real team member available 24/7.",
    accent: "#a78bfa",
    border: "rgba(167,139,250,0.18)",
    glow: "rgba(167,139,250,0.06)",
  },
];

export function OutcomesSection() {
  return (
    <section id="services" className="px-6 md:py-12 py-6 lg:px-10 relative overflow-hidden">
      {/* Background */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] rounded-full bg-blue-900/8 blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-[400px] h-[400px] rounded-full bg-violet-900/8 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <Reveal className="mb-14">
          <div className="inline-flex items-center gap-2 border border-indigo-500/25 bg-indigo-500/[0.08] rounded-full px-4 py-1.5 mb-5">
            <span className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-blue-300 font-mono">Why Kufu</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <h2
              className="font-display font-black text-white"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
            >
              Everything your website{" "}
              <br className="hidden lg:block" />
              needs to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                convert more visitors
              </span>
            </h2>
            <p className="text-slate-400 max-w-sm leading-relaxed text-sm lg:text-base lg:text-right">
              Built for business owners who want results without the technical complexity.
            </p>
          </div>
        </Reveal>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.07}>
              <div
                className="group rounded-2xl p-7 flex flex-col h-full hover:-translate-y-1 transition-all duration-300"
                style={{
                  background: "linear-gradient(145deg, rgba(10,15,35,0.9), rgba(8,12,28,0.8))",
                  border: `1px solid ${f.border}`,
                  boxShadow: `0 4px 24px ${f.glow}, inset 0 1px 0 rgba(255,255,255,0.03)`,
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${f.accent}18, ${f.accent}08)`,
                    border: `1px solid ${f.accent}30`,
                  }}
                >
                  {f.icon}
                </div>

                {/* Title */}
                <h3
                  className="font-display font-bold text-white mb-2.5 leading-snug"
                  style={{ fontSize: "1.02rem" }}
                >
                  {f.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-slate-400 flex-1">{f.description}</p>

                {/* Bottom accent */}
                <div
                  className="mt-5 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: `linear-gradient(90deg, ${f.accent}60, transparent)` }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}