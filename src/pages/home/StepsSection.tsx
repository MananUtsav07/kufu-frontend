import { Reveal } from "./Reveal";

const steps = [
  {
    id: "01",
    icon: "🔗",
    title: "Create Your Account",
    description: "Sign up and enter your website URL. That's all we need to get started — no technical setup required.",
    accent: "from-blue-500/20 to-blue-600/5",
    border: "rgba(59,130,246,0.2)",
    glow: "rgba(59,130,246,0.08)",
    dot: "#3b82f6",
  },
  {
    id: "02",
    icon: "🧠",
    title: "We Train Your Chatbot",
    description: "Kufu crawls your website and custom knowledge base automatically — building a smart AI tuned to your business.",
    accent: "from-indigo-500/20 to-indigo-600/5",
    border: "rgba(99,102,241,0.2)",
    glow: "rgba(99,102,241,0.08)",
    dot: "#6366f1",
  },
  {
    id: "03",
    icon: "⚡",
    title: "Add One Script Tag",
    description: "Copy your unique snippet and paste it into your website. Your AI chatbot goes live instantly — on any platform.",
    accent: "from-violet-500/20 to-violet-600/5",
    border: "rgba(139,92,246,0.2)",
    glow: "rgba(139,92,246,0.08)",
    dot: "#8b5cf6",
  },
  {
    id: "04",
    icon: "🚀",
    title: "Go Live & Improve",
    description: "Your chatbot answers visitors 24/7. Add more knowledge anytime from your dashboard to make it smarter over time.",
    accent: "from-blue-500/20 to-violet-500/5",
    border: "rgba(99,102,241,0.2)",
    glow: "rgba(99,102,241,0.06)",
    dot: "#a78bfa",
  },
];

export function StepsSection() {
  return (
    <section id="how-it-works" className="py-28 px-6 lg:px-10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <Reveal className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-indigo-500/25 bg-indigo-500/[0.08] rounded-full px-4 py-1.5 mb-5">
            <span className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-blue-300 font-mono">How It Works</span>
          </div>
          <h2
            className="font-display font-black text-white mb-4"
            style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            Up and running in{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              4 simple steps
            </span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto leading-relaxed text-base">
            No developers needed. No complex setup. Just a smarter website in minutes.
          </p>
        </Reveal>

        {/* Connector line — desktop only */}
        <div className="hidden lg:block relative mb-2">
          <div
            className="absolute top-8 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3) 20%, rgba(139,92,246,0.3) 80%, transparent)",
            }}
          />
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.1}>
              <div
                className="relative rounded-2xl p-6 h-full flex flex-col hover:-translate-y-1 transition-all duration-300 group"
                style={{
                  background: `linear-gradient(145deg, rgba(10,15,30,0.95), rgba(8,12,25,0.9))`,
                  border: `1px solid ${s.border}`,
                  boxShadow: `0 8px 32px ${s.glow}, inset 0 1px 0 rgba(255,255,255,0.03)`,
                }}
              >
                {/* Step number — watermark */}
                <span
                  className="absolute top-4 right-5 font-display font-black text-6xl select-none"
                  style={{
                    background: `linear-gradient(135deg, ${s.dot}22, transparent)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {s.id}
                </span>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${s.dot}20, ${s.dot}08)`,
                    border: `1px solid ${s.border}`,
                  }}
                >
                  {s.icon}
                </div>

                {/* Step label */}
                <p
                  className="text-[0.65rem] font-bold tracking-[0.18em] uppercase mb-2 font-mono"
                  style={{ color: s.dot }}
                >
                  Step {s.id}
                </p>

                {/* Title */}
                <h3
                  className="font-display font-bold text-white mb-2.5 leading-snug"
                  style={{ fontSize: "1.05rem" }}
                >
                  {s.title}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-slate-400 flex-1">
                  {s.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className="mt-5 h-px w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${s.dot}60, transparent)`,
                  }}
                />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom CTA nudge */}
        <Reveal className="text-center mt-14">
          <p className="text-slate-500 text-sm">
            Most businesses are live in{" "}
            <span className="text-white font-semibold">under 5 minutes.</span>
            {" "}No engineers required.
          </p>
        </Reveal>
      </div>
    </section>
  );
}