import { useState } from "react";
import { Reveal } from "./Reveal";
import { useNavigate } from "react-router-dom";

const faqs = [
  {
    question: "Do I need to know how to code?",
    answer:
      "Not at all. You just paste one script tag into your website — if you can add a Google Analytics tag, you can add Kufu. Everything else is handled automatically.",
  },
  {
    question: "How does Kufu train on my website?",
    answer:
      "Kufu crawls your website pages automatically and extracts the content to train your chatbot. No manual uploads, no data entry — it all happens in the background.",
  },
  {
    question: "What if my website content changes?",
    answer:
      "You can re-sync your website anytime from your dashboard with one click. Your chatbot will be retrained with the latest content immediately.",
  },
  {
    question: "Can I add custom information beyond my website?",
    answer:
      "Yes. From your dashboard you can add any extra knowledge — FAQs, pricing, policies, team info, anything your chatbot should know that may not be on your website.",
  },
  {
    question: "Which website platforms are supported?",
    answer:
      "Any platform — React, Next.js, WordPress, Webflow, Wix, Shopify, or plain HTML. If it's a website, Kufu works on it.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Your data is stored securely and your chatbot is locked to your domain only via allowed domain protection. No one else can use your widget key.",
  },
  {
    question: "Can I customize the chatbot?",
    answer:
      "Yes. You can update the chatbot name, greeting message, allowed domains, and knowledge base directly from your dashboard at any time.",
  },
];

function FAQItem({
  question,
  answer,
  defaultOpen,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: open
          ? "linear-gradient(145deg, rgba(15,23,50,0.98), rgba(12,18,42,0.95))"
          : "linear-gradient(145deg, rgba(10,15,35,0.8), rgba(8,12,28,0.7))",
        border: open
          ? "1px solid rgba(99,102,241,0.25)"
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: open ? "0 8px 32px rgba(99,102,241,0.08)" : "none",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span
          className="font-semibold text-sm leading-snug transition-colors"
          style={{ color: open ? "#fff" : "#cbd5e1" }}
        >
          {question}
        </span>
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            background: open
              ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
              : "rgba(255,255,255,0.05)",
            border: open ? "none" : "1px solid rgba(255,255,255,0.08)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="px-6 pb-5">
          <div
            className="h-px w-full mb-4"
            style={{
              background:
                "linear-gradient(90deg, rgba(99,102,241,0.3), transparent)",
            }}
          />
          <p className="text-sm text-slate-400 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function FaqSection() {
  const navigate = useNavigate();
  return (
    <section id="faq" className="py-28 px-6 lg:px-10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-900/8 blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <Reveal className="text-center mb-14">
          <div className="inline-flex items-center gap-2 border border-indigo-500/25 bg-indigo-500/[0.08] rounded-full px-4 py-1.5 mb-5">
            <span className="text-[0.68rem] font-bold tracking-[0.18em] uppercase text-blue-300 font-mono">
              FAQ
            </span>
          </div>
          <h2
            className="font-display font-black text-white mb-4"
            style={{
              fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Got{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Questions?
            </span>
          </h2>
          <p className="text-slate-400 leading-relaxed max-w-md mx-auto">
            Everything you need to know about Kufu. Can't find your answer?{" "}
            <span onClick={() => navigate("/contact")} className="text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors">
              Talk to us.
            </span>
          </p>
        </Reveal>

        {/* FAQ items */}
        <div className="space-y-2.5">
          {faqs.map((f, i) => (
            <Reveal key={f.question} delay={i * 0.06}>
              <FAQItem
                question={f.question}
                answer={f.answer}
                defaultOpen={i === 0}
              />
            </Reveal>
          ))}
        </div>

        {/* Bottom note */}
        <Reveal className="text-center mt-12">
          <p className="text-slate-600 text-sm">
            Still have questions?{" "}
            <span
              onClick={() => navigate("/contact")}
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors font-medium"
            >
              Contact our team →
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
