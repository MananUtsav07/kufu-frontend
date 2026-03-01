import { useNavigate } from "react-router-dom";
import { BotIcon } from "./BotIcon";

type HeroSectionProps = {
  onScrollTo: (id: string) => void;
};

const stats: [string, string][] = [
  ["24/7", "Always Online"],
  ["< 2min", "Setup Time"],
  ["Any Site", "Any Framework"],
];

const chatMessages = [
  { from: "bot", text: "👋 Hi! I'm trained on your website. Ask me anything!" },
  { from: "user", text: "What services do you offer?" },
  {
    from: "bot",
    text: "We offer web design, SEO, and growth consulting. Want to know more or book a free call?",
  },
];

export function HeroSection({ onScrollTo }: HeroSectionProps) {
  const navigate = useNavigate();
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden pb-24 pt-12 lg:pb-32 lg:pt-30 px-6 lg:px-10"
    >
      {/* Rich background atmosphere */}
      <div className="absolute inset-0 -z-10 bg-[#020617]" />
      <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full bg-violet-700/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-indigo-900/20 blur-[80px] pointer-events-none" />

      {/* Subtle grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,transparent_40%,#020617_100%)]" />

      <div className="max-w-7xl mx-auto">
        {/* TOP BADGE — centered */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2.5 border border-indigo-500/25 bg-indigo-500/[0.08] rounded-full px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 pulse-dot" />
            <span className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-blue-300 font-mono">
              No Coding Required · Auto-Trained AI
            </span>
          </div>
        </div>

        {/* HEADLINE — centered, large & airy */}
        <div className="text-center mb-6 max-w-4xl mx-auto">
          <h1
            className="font-display font-black text-white hero-enter [animation-delay:0.15s]"
            style={{
              fontSize: "clamp(3rem, 6.5vw, 5rem)",
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
            }}
          >
            Your Website,{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #818cf8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Now Smarter
            </span>
            <br />
            Than Ever.
          </h1>
        </div>

        {/* SUBHEADLINE — centered */}
        <p className="hero-enter [animation-delay:0.25s] text-center text-lg text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
          Kufu trains an AI chatbot on your website content and custom knowledge
          base — automatically. Visitors get instant answers. You get more
          conversions.
        </p>

        {/* Two-layer pill */}
        <div className="hero-enter [animation-delay:0.3s] flex justify-center mb-10">
          <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-indigo-500/20 rounded-full px-5 py-2.5">
            <span className="text-blue-400 text-sm">⚡</span>
            <p className="text-[0.82rem] text-slate-300">
              <strong className="text-white font-semibold">
                Website content
              </strong>
              <span className="text-slate-500 mx-2">+</span>
              <strong className="text-white font-semibold">
                Custom knowledge base
              </strong>
              <span className="text-slate-400 ml-2">
                = one powerful chatbot
              </span>
            </p>
          </div>
        </div>

        {/* CTAs — centered */}
        <div className="hero-enter [animation-delay:0.35s] flex flex-wrap justify-center gap-4 mb-16">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)",
              boxShadow:
                "0 4px 24px rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.2)",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            Get Started Free
          </button>
          <button
            type="button"
            onClick={() => onScrollTo("pricing")}
            className="font-semibold text-sm px-8 py-3.5 rounded-full border border-white/10 text-slate-300 hover:border-indigo-500/40 hover:text-white hover:bg-white/[0.04] transition-all"
          >
            See Pricings ↓
          </button>
        </div>

        {/* MAIN CONTENT — two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* LEFT — Stats + features */}
          <div className="flex flex-col gap-5">
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map(([val, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 hover:border-indigo-500/30 hover:bg-indigo-500/[0.04] transition-all group"
                >
                  <p
                    className="font-display font-black text-white text-2xl mb-1 group-hover:text-blue-300 transition-colors"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {val}
                  </p>
                  <p className="text-[0.62rem] uppercase tracking-widest text-slate-500 font-mono">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Feature list */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 space-y-5">
              {[
                {
                  icon: "🌐",
                  title: "Auto-crawls your website",
                  desc: "We train your chatbot automatically — no uploads, no manual work needed.",
                },
                {
                  icon: "📚",
                  title: "Custom knowledge base",
                  desc: "Add FAQs, policies, and pricing from your dashboard anytime.",
                },
                {
                  icon: "⚡",
                  title: "One script tag setup",
                  desc: "Paste one line of code. Your chatbot goes live instantly.",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15))",
                      border: "1px solid rgba(99,102,241,0.2)",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">
                      {item.title}
                    </p>
                    <p className="text-[0.8rem] text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Chat Widget */}
          <div className="float-anim">
            <div
              className="relative rounded-2xl p-6"
              style={{
                background:
                  "linear-gradient(145deg, rgba(15,23,42,0.95), rgba(8,12,28,0.98))",
                border: "1px solid rgba(99,102,241,0.15)",
                boxShadow:
                  "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Floating badge */}
              <div
                className="absolute -top-4 -right-4 px-4 py-2 rounded-xl text-xs font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  boxShadow: "0 4px 16px rgba(99,102,241,0.5)",
                }}
              >
                ⚡ Auto-trained
              </div>

              {/* Header */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/[0.06]">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)",
                    boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
                  }}
                >
                  <BotIcon size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Kufu Assistant</p>
                  <p className="text-[0.7rem] text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Trained on your website
                  </p>
                </div>
                <span className="ml-auto text-[0.62rem] font-semibold uppercase tracking-widest text-slate-600 font-mono">
                  Live Preview
                </span>
              </div>

              {/* Messages */}
              <div className="flex flex-col gap-3 mb-5">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`max-w-[84%] px-4 py-3 text-sm leading-relaxed ${
                      msg.from === "bot"
                        ? "self-start text-slate-200 rounded-[18px_18px_18px_4px]"
                        : "self-end text-slate-300 rounded-[18px_18px_4px_18px]"
                    }`}
                    style={
                      msg.from === "bot"
                        ? {
                            background:
                              "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.12))",
                            border: "1px solid rgba(99,102,241,0.2)",
                          }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.07)",
                          }
                    }
                  >
                    {msg.text}
                  </div>
                ))}

                {/* Typing indicator */}
                <div className="flex items-center gap-1.5 self-start mt-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400 dot-blink" />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 dot-blink-2" />
                  <span className="w-2 h-2 rounded-full bg-violet-400 dot-blink-3" />
                  <span className="text-[0.7rem] text-slate-500 ml-1.5">
                    Kufu is typing…
                  </span>
                </div>
              </div>

              {/* Knowledge sources */}
              <div className="border-t border-white/[0.06] pt-4 mb-4">
                <p className="text-[0.62rem] uppercase tracking-widest text-slate-600 mb-2.5 font-mono">
                  Knowledge Sources
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Website Content",
                    "Custom FAQs",
                    "Pricing Info",
                    "Policies",
                  ].map((s) => (
                    <span
                      key={s}
                      className="text-[0.72rem] font-semibold px-2.5 py-1 rounded-full text-indigo-300"
                      style={{
                        background: "rgba(99,102,241,0.08)",
                        border: "1px solid rgba(99,102,241,0.18)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Script tag */}
              <div
                className="rounded-xl px-4 py-3 font-mono text-[0.72rem] text-slate-400"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <span className="text-blue-400">&lt;script</span>
                <span className="text-slate-500"> src=</span>
                <span className="text-emerald-400">"kufu.js?key=YOUR_KEY"</span>
                <span className="text-blue-400">&gt;&lt;/script&gt;</span>
                <span className="ml-2 text-slate-600">{"// that's it"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
