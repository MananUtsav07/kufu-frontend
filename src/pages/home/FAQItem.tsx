import { useState } from "react";

export function FAQItem({ question, answer, defaultOpen }: { question: string; answer: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div
      className="rounded-2xl transition-all duration-300"
      style={{
        background: open
          ? "linear-gradient(145deg, rgba(15,23,50,0.98), rgba(12,18,42,0.95))"
          : "linear-gradient(145deg, rgba(10,15,35,0.8), rgba(8,12,28,0.7))",
        border: open ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: open ? "0 8px 32px rgba(99,102,241,0.08)" : "none",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span
          className="font-semibold text-sm leading-snug transition-colors duration-300"
          style={{ color: open ? "#fff" : "#cbd5e1" }}
        >
          {question}
        </span>
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            background: open ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "rgba(255,255,255,0.05)",
            border: open ? "none" : "1px solid rgba(255,255,255,0.08)",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>

      <div
        className="grid transition-all duration-400 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-5">
            <div
              className="h-px w-full mb-4"
              style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.3), transparent)" }}
            />
            <p className="text-sm text-slate-400 leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}