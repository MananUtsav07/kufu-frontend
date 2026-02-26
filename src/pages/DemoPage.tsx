import { motion } from "framer-motion";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { FooterSection } from "./home/FooterSection";

/* ─── tiny helpers ──────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    delay,
  },
});

const FEATURES = [
  { icon: "⚡", label: "Instant lead capture" },
  { icon: "🤖", label: "AI-qualified prospects" },
  { icon: "📅", label: "Auto-scheduled follow-ups" },
  { icon: "📊", label: "Real-time analytics" },
];

/* ─── main component ─────────────────────────────────────────────── */
export function DemoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    businessType: "SaaS / Tech",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#060714] text-slate-200">
      {/* ── Google Fonts ── */}
      <style>{`
        input, select, textarea { color-scheme: dark; }
        input::placeholder, textarea::placeholder { color: #475569; }
        select option { background: #0f172a; }

        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: .6; }
          100% { transform: scale(1.6); opacity: 0;  }
        }
        .pulse-ring::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px solid #6366f1;
          animation: pulse-ring 1.8s ease-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .float { animation: float 4s ease-in-out infinite; }

        .grad-text {
          background: linear-gradient(135deg, #818cf8, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .grad-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
        }
        .card-glass {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.07);
        }
        .input-base {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          padding: 11px 14px;
          color: #e2e8f0;
          font-size: 14px;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .input-base:focus {
          border-color: rgba(99,102,241,.55);
          box-shadow: 0 0 0 3px rgba(99,102,241,.12);
        }
        .label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 6px;
        }
      `}</style>

      {/* ── ambient blobs ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute"
          style={{
            top: "-10%",
            right: "-8%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99,102,241,.18) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "-15%",
            left: "-10%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,.04) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <Navbar page="demo" />

      {/* ── two-column hero ── */}
      <section className="relative z-10 flex flex-1 flex-col">
        <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-12 px-6 py-12 md:px-12 lg:grid-cols-2 lg:py-16">
          {/* LEFT — copy + form */}
          <div className="space-y-8">
            {/* badge */}
            <motion.div {...fadeUp(0)}>
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-indigo-300"
                style={{
                  border: "1px solid rgba(99,102,241,.3)",
                  background: "rgba(99,102,241,.1)",
                }}
              >
                <span
                  className="relative h-2 w-2 rounded-full bg-indigo-400 pulse-ring"
                  style={{ display: "inline-block" }}
                />
                Live AI Demo
              </span>
            </motion.div>

            {/* headline */}
            <motion.div {...fadeUp(0.07)} className="space-y-3">
              <h1 className="font-display text-5xl font-black leading-[1.08] tracking-tight text-white md:text-6xl">
                Scale your sales
                <br />
                with <span className="grad-text">AI Automation.</span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-slate-400">
                Stop chasing leads manually. Our AI identifies, engages, and
                qualifies high-intent prospects&nbsp;24/7.
              </p>
            </motion.div>

            {/* feature pills */}
            <motion.div {...fadeUp(0.14)} className="flex flex-wrap gap-2">
              {FEATURES.map((f) => (
                <span
                  key={f.label}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-slate-300"
                  style={{
                    background: "rgba(255,255,255,.04)",
                    border: "1px solid rgba(255,255,255,.07)",
                  }}
                >
                  <span>{f.icon}</span> {f.label}
                </span>
              ))}
            </motion.div>

            {/* ── FORM CARD ── */}
            <motion.div {...fadeUp(0.2)}>
              <div className="card-glass rounded-2xl p-6 shadow-[0_32px_80px_rgba(0,0,0,.5)] md:p-8">
                {submitted ? (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-full"
                      style={{
                        background: "rgba(16,185,129,.15)",
                        border: "1px solid rgba(16,185,129,.3)",
                      }}
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">You're in!</h3>
                    <p className="max-w-xs text-sm text-slate-400">
                      We'll set up your AI assistant and send a demo link to
                      your email within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-4"
                  >
                    <p className="mb-2 text-xs text-slate-500">
                      Free 7-day setup — no credit card required
                    </p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="label" htmlFor="fullName">
                          Full Name
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          placeholder="John Doe"
                          required
                          className="input-base"
                          value={form.fullName}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="label" htmlFor="businessType">
                          Business Type
                        </label>
                        <select
                          id="businessType"
                          name="businessType"
                          className="input-base"
                          value={form.businessType}
                          onChange={handleChange}
                        >
                          <option>SaaS / Tech</option>
                          <option>Real Estate</option>
                          <option>E-commerce</option>
                          <option>Service Provider</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="label" htmlFor="phone">
                          Phone
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="input-base"
                          value={form.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="label" htmlFor="email">
                          Email Address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@company.com"
                          required
                          className="input-base"
                          value={form.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label" htmlFor="message">
                        How can we help?
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        placeholder="Tell us about your lead gen goals..."
                        className="input-base resize-none"
                        value={form.message}
                        onChange={handleChange}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="grad-btn group flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-70"
                      style={{ boxShadow: "0 8px 28px rgba(99,102,241,.38)" }}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                          Setting up your demo…
                        </>
                      ) : (
                        <>
                          Start Free Trial
                          <svg
                            className="transition-transform group-hover:translate-x-1"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT — chat widget preview */}
          <motion.div
            {...fadeUp(0.28)}
            className="hidden lg:flex lg:items-center lg:justify-center"
          >
            <div className="float w-full max-w-[420px]">
              <div className="card-glass overflow-hidden rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,.55)]">
                {/* chat header */}
                <div
                  className="flex items-center gap-3 px-5 py-4"
                  style={{ borderBottom: "1px solid rgba(255,255,255,.07)" }}
                >
                  <div className="relative">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full"
                      style={{
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                      </svg>
                    </div>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400"
                      style={{ border: "2px solid #060714" }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Kufu Assistant
                    </p>
                    <p className="text-[11px] font-medium text-emerald-400">
                      ● AI ACTIVE
                    </p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-slate-600"
                      />
                    ))}
                  </div>
                </div>

                {/* messages */}
                <div className="space-y-4 px-5 py-5">
                  <ChatBubble side="left" delay={0}>
                    Hi there 👋 Looking to automate your customer inquiries? I
                    can show you how Kufu handles replies, qualifies leads, and
                    books appointments — automatically.
                  </ChatBubble>

                  <ChatBubble side="right" delay={0.3}>
                    What are your pricing tiers?
                  </ChatBubble>

                  <ChatBubble side="left" delay={0.6}>
                    Here's a quick overview:
                    <br />
                    <br />
                    🆓 <strong>7-day free pilot</strong> — no upfront cost
                    <br />
                    🚀 <strong>Starter</strong> ₹1,999/mo — chatbot + lead
                    capture
                    <br />⚡ <strong>Pro</strong> ₹3,999/mo — WhatsApp +
                    Instagram
                    <br />
                    🏢 <strong>Business</strong> ₹7,999/mo — custom CRM +
                    priority support
                  </ChatBubble>
                </div>

                {/* quick replies */}
                <div
                  className="flex flex-wrap gap-2 px-5 pb-4"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,.05)",
                    paddingTop: 14,
                  }}
                >
                  {["Integration Guide", "View Pricing", "Talk to Human"].map(
                    (label) => (
                      <button
                        key={label}
                        type="button"
                        className="rounded-full px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-indigo-500/20 hover:text-indigo-300"
                        style={{
                          border: "1px solid rgba(255,255,255,.1)",
                          background: "rgba(255,255,255,.04)",
                        }}
                      >
                        {label}
                      </button>
                    ),
                  )}
                </div>

                {/* input */}
                <div className="flex items-center gap-3 px-4 pb-4">
                  <input
                    readOnly
                    placeholder="Type a message…"
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm text-slate-400"
                    style={{
                      background: "rgba(255,255,255,.04)",
                      border: "1px solid rgba(255,255,255,.08)",
                      outline: "none",
                    }}
                  />
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* floating stats card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="card-glass absolute -right-6 top-1/4 hidden rounded-2xl px-4 py-3 shadow-xl xl:block"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Leads this week
                </p>
                <p className="mt-0.5 text-2xl font-black text-white">+247</p>
                <p className="text-xs text-emerald-400">↑ 32% vs last week</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── footer ── */}
      <FooterSection />
    </div>
  );
}

/* ── chat bubble sub-component ────────────────────────────────── */
function ChatBubble({
  children,
  side,
  delay,
}: {
  children: React.ReactNode;
  side: "left" | "right";
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${side === "right" ? "justify-end" : "justify-start"}`}
    >
      <div
        className="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
        style={
          side === "left"
            ? { background: "rgba(255,255,255,.05)", color: "#cbd5e1" }
            : {
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "white",
              }
        }
      >
        {children}
      </div>
    </motion.div>
  );
}
