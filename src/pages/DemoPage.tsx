import { motion } from "framer-motion";
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { FooterSection } from "./home/FooterSection";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    delay,
  },
});

const BENEFITS = [
  { icon: "🌐", label: "We crawl & train on your website" },
  { icon: "📚", label: "Custom knowledge base setup" },
  { icon: "⚡", label: "Live in under 5 minutes" },
  { icon: "💬", label: "Answers visitors 24/7" },
];

const STEPS = [
  { step: "01", title: "Fill the form", desc: "Tell us about your business and website." },
  { step: "02", title: "We reach out", desc: "Our team contacts you within 24 hours." },
  { step: "03", title: "Schedule a call", desc: "We walk you through a live demo of Kufu." },
  { step: "04", title: "Go live", desc: "Your chatbot is set up and running on your site." },
];

export function DemoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    businessName: "",
    websiteUrl: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col pt-20 overflow-x-hidden bg-[#020617] text-slate-200">
      <style>{`
        input, select, textarea { color-scheme: dark; }
        input::placeholder, textarea::placeholder { color: #475569; }
        select option { background: #0f172a; }
        .input-base {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 11px 14px;
          color: #e2e8f0;
          font-size: 14px;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .input-base:focus {
          border-color: rgba(99,102,241,.5);
          box-shadow: 0 0 0 3px rgba(99,102,241,.1);
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

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-700/10 blur-[100px]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <Navbar page="demo" />

      <section className="relative z-10 flex-1 py-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT — copy */}
          <div className="space-y-10 lg:sticky lg:top-24">

            {/* Badge */}
            <motion.div {...fadeUp(0)}>
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-blue-300"
                style={{ border: "1px solid rgba(59,130,246,.3)", background: "rgba(59,130,246,.08)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Free Demo · No Commitment
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div {...fadeUp(0.08)} className="space-y-4">
              <h1
                className="font-display font-black text-white leading-[1.06]"
                style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", letterSpacing: "-0.03em" }}
              >
                See Kufu in action
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  on your website.
                </span>
              </h1>
              <p className="text-lg leading-relaxed text-slate-400 max-w-md">
                Fill in the form and our team will reach out to schedule a
                personalized demo — we'll show you exactly how Kufu works for
                your specific website and business.
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div {...fadeUp(0.14)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BENEFITS.map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span className="text-lg">{b.icon}</span>
                  <span className="text-sm text-slate-300 font-medium">{b.label}</span>
                </div>
              ))}
            </motion.div>

            {/* What happens next */}
            <motion.div {...fadeUp(0.2)}>
              <p className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-slate-500 mb-5 font-mono">What happens next</p>
              <div className="space-y-4">
                {STEPS.map((s, i) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[0.65rem] font-bold flex-shrink-0 font-mono"
                      style={{
                        background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15))",
                        border: "1px solid rgba(99,102,241,0.25)",
                        color: "#818cf8",
                      }}
                    >
                      {s.step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white mb-0.5">{s.title}</p>
                      <p className="text-[0.8rem] text-slate-500 leading-relaxed">{s.desc}</p>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="absolute left-4 mt-8 w-px h-4 bg-indigo-500/20" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT — form */}
          <motion.div {...fadeUp(0.22)}>
            <div
              className="rounded-2xl p-8"
              style={{
                background: "linear-gradient(145deg, rgba(12,18,40,0.98), rgba(8,14,32,0.95))",
                border: "1px solid rgba(99,102,241,0.18)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Top accent */}
              <div
                className="h-px w-full mb-8 rounded-full"
                style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(139,92,246,0.5), transparent)" }}
              />

              {submitted ? (
                <div className="flex flex-col items-center gap-5 py-12 text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">We'll be in touch!</h3>
                    <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                      Thanks for your interest. Our team will contact you within
                      24 hours to schedule your personalized demo.
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-xs text-emerald-400 font-medium"
                    style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Check your email for confirmation
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="mb-6">
                    <h2 className="font-display font-bold text-white text-xl mb-1">Request a Free Demo</h2>
                    <p className="text-sm text-slate-500">We'll set up a call and show you Kufu live on your website.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="fullName">Full Name</label>
                      <input
                        id="fullName" name="fullName" type="text"
                        placeholder="John Doe" required
                        className="input-base"
                        value={form.fullName} onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="businessName">Business Name</label>
                      <input
                        id="businessName" name="businessName" type="text"
                        placeholder="Acme Inc." required
                        className="input-base"
                        value={form.businessName} onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="websiteUrl">Website URL</label>
                    <input
                      id="websiteUrl" name="websiteUrl" type="url"
                      placeholder="https://yourwebsite.com"
                      className="input-base"
                      value={form.websiteUrl} onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="email">Email Address</label>
                      <input
                        id="email" name="email" type="email"
                        placeholder="john@company.com" required
                        className="input-base"
                        value={form.email} onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="phone">Phone Number</label>
                      <input
                        id="phone" name="phone" type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="input-base"
                        value={form.phone} onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="message">What do you want from your chatbot?</label>
                    <textarea
                      id="message" name="message" rows={3}
                      placeholder="e.g. Answer FAQs, capture leads, explain our services..."
                      className="input-base resize-none"
                      value={form.message} onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-70"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)",
                      boxShadow: "0 4px 24px rgba(99,102,241,0.4)",
                    }}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Submitting…
                      </>
                    ) : (
                      <>
                        Request My Free Demo
                        <svg
                          className="transition-transform group-hover:translate-x-1"
                          width="16" height="16" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[0.72rem] text-slate-600">
                    No credit card required · We'll contact you within 24 hours
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}