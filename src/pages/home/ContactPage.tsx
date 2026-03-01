import { motion } from "framer-motion";
import { useState } from "react";
import { Navbar } from "../../components/Navbar";
import { ApiError, postContactLead } from "../../lib/api";
import { FooterSection } from "./FooterSection";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    delay,
  },
});

const TOPICS = [
  "General Inquiry",
  "Pricing & Plans",
  "Technical Support",
  "Partnership",
  "Other",
];

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    topic: "General Inquiry",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setLoading(true);

    try {
      const fullNameParts = form.fullName
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      const firstName = fullNameParts[0] ?? form.fullName.trim();
      const lastName = fullNameParts.slice(1).join(" ") || "N/A";
      const combinedMessage = `Topic: ${form.topic}\n\n${form.message}`;

      await postContactLead({
        firstName,
        lastName,
        email: form.email.trim(),
        message: combinedMessage.trim(),
      });

      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col pt-10 md:pt-20 overflow-x-hidden bg-[#020617] text-slate-200">
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
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-violet-700/8 blur-[100px]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <Navbar page="contact" />

      <section className="relative z-10 flex-1 py-16 px-6 lg:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* LEFT — info */}
          <div className="lg:sticky lg:top-24 space-y-10">
            {/* Badge */}
            <motion.div {...fadeUp(0)}>
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-blue-300"
                style={{
                  border: "1px solid rgba(59,130,246,.3)",
                  background: "rgba(59,130,246,.08)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                We reply within 24 hours
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div {...fadeUp(0.08)}>
              <h1
                className="font-display font-black text-white mb-4"
                style={{
                  fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.08,
                }}
              >
                Let's talk about{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  your website.
                </span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                Have a question about Kufu? Want to know if it's right for your
                business? Just want to say hi? We'd love to hear from you.
              </p>
            </motion.div>

            {/* Email card */}
            <motion.div {...fadeUp(0.14)}>
              <div
                className="rounded-2xl p-6 flex items-center gap-4"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(12,18,40,0.95), rgba(8,14,32,0.9))",
                  border: "1px solid rgba(99,102,241,0.18)",
                  boxShadow: "0 8px 32px rgba(99,102,241,0.06)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15))",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#818cf8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <p className="text-[0.68rem] font-bold tracking-[0.15em] uppercase text-slate-500 font-mono mb-1">
                    Email us directly
                  </p>
                  <a
                    href="mailto:hello@kufu.ai"
                    className="text-white font-semibold text-sm hover:text-blue-300 transition-colors"
                  >
                    kufuchatbot@gmail.com   
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Response time */}
            <motion.div {...fadeUp(0.18)} className="space-y-3">
              {[
                { label: "General inquiries", time: "Within 24 hours" },
                { label: "Technical support", time: "Within 12 hours" },
                { label: "Partnership requests", time: "Within 48 hours" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3 border-b border-white/[0.05]"
                >
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span
                    className="text-[0.72rem] font-semibold px-2.5 py-1 rounded-full font-mono"
                    style={{
                      background: "rgba(99,102,241,0.08)",
                      border: "1px solid rgba(99,102,241,0.18)",
                      color: "#818cf8",
                    }}
                  >
                    {item.time}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — form */}
          <motion.div {...fadeUp(0.22)}>
            <div
              className="rounded-2xl p-8"
              style={{
                background:
                  "linear-gradient(145deg, rgba(12,18,40,0.98), rgba(8,14,32,0.95))",
                border: "1px solid rgba(99,102,241,0.18)",
                boxShadow:
                  "0 32px_80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Top accent line */}
              <div
                className="h-px w-full mb-8 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(139,92,246,0.5), transparent)",
                }}
              />

              {submitted ? (
                <div className="flex flex-col items-center gap-5 py-12 text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(16,185,129,0.12)",
                      border: "1px solid rgba(16,185,129,0.25)",
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
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Message sent!
                    </h3>
                    <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                      Thanks for reaching out. We'll get back to you at your
                      email address within 24 hours.
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-xs text-emerald-400 font-medium"
                    style={{
                      background: "rgba(16,185,129,0.08)",
                      border: "1px solid rgba(16,185,129,0.2)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Check your email for confirmation
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {submitError ? (
                    <div
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                    >
                      {submitError}
                    </div>
                  ) : null}

                  <div className="mb-6">
                    <h2 className="font-display font-bold text-white text-xl mb-1">
                      Send us a message
                    </h2>
                    <p className="text-sm text-slate-500">
                      We read every message and reply personally.
                    </p>
                  </div>

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
                    <label className="label" htmlFor="topic">
                      Topic
                    </label>
                    <select
                      id="topic"
                      name="topic"
                      className="input-base"
                      value={form.topic}
                      onChange={handleChange}
                    >
                      {TOPICS.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell us how we can help..."
                      required
                      className="input-base resize-none"
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-70"
                    style={{
                      background:
                        "linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)",
                      boxShadow: "0 4px 24px rgba(99,102,241,0.4)",
                    }}
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
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg
                          className="transition-transform group-hover:translate-x-1"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[0.72rem] text-slate-600">
                    We reply to every message personally · No spam ever
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
