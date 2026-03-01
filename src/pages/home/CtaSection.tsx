import { useNavigate } from "react-router-dom";
import { Reveal } from "./Reveal";

export function CtaSection() {
  const navigate = useNavigate();
  return (
    <section
      id="contact"
      className="py-24 px-6 lg:px-10 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[2rem] p-14 text-center"
            style={{
              background:
                "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(10,12,30,0.99))",
              border: "1px solid rgba(99,102,241,0.2)",
              boxShadow:
                "0 0 0 1px rgba(99,102,241,0.08), 0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* Background glows inside card */}
            <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            {/* Top gradient border line */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(59,130,246,0.6), transparent)",
              }}
            />

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 border border-indigo-500/25 bg-indigo-500/[0.08] rounded-full px-4 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-blue-300 font-mono">
                  Free to Start · No Credit Card
                </span>
              </div>

              {/* Headline */}
              <h2
                className="font-display font-black text-white mb-5"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                Ready to Give Your
                <br />
                Website a{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Brain?
                </span>
              </h2>

              {/* Subtext */}
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto mb-10">
                Join businesses already using Kufu to answer visitor questions
                instantly — trained on their website, running 24/7, no engineers
                needed.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center gap-2 text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)",
                    boxShadow:
                      "0 4px 24px rgba(99,102,241,0.45), 0 0 0 1px rgba(99,102,241,0.2)",
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
                  onClick={() => navigate("/demo")}
                  className="font-semibold text-sm px-8 py-3.5 rounded-full border border-white/10 text-slate-300 hover:border-indigo-500/40 hover:text-white hover:bg-white/[0.04] transition-all"
                >
                  Get Free Demo
                </button>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-[0.78rem]">
                {[
                  { icon: "✓", text: "Free plan available" },
                  { icon: "✓", text: "Setup in under 5 minutes" },
                  { icon: "✓", text: "Works on any website" },
                  { icon: "✓", text: "Cancel anytime" },
                ].map((item) => (
                  <span key={item.text} className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">
                      {item.icon}
                    </span>
                    {item.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
