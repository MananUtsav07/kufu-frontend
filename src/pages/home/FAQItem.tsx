import { useState } from "react";
import type { FAQItemProps } from "./HomeTypes";

export function FAQItem({ question, answer, defaultOpen = false }: FAQItemProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden backdrop-blur-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left font-bold text-sm text-slate-100 hover:text-white transition-colors"
      >
        {question}
        <svg
          className={`w-5 h-5 text-indigo-400 transition-transform duration-300 flex-shrink-0 ml-4 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open ? <div className="px-6 pb-5 text-sm leading-relaxed text-slate-400">{answer}</div> : null}
    </div>
  );
}
