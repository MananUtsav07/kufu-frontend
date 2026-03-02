import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrandBotIcon } from "./BrandBotIcon";

type FloatingChatButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function FloatingChatButton({
  isOpen,
  onToggle,
}: FloatingChatButtonProps) {
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingDismissed, setGreetingDismissed] = useState(false);

  useEffect(() => {
  if (isOpen) {
    const timer = window.setTimeout(() => {
      setShowGreeting(false)
      setGreetingDismissed(true)
    }, 0)
    return () => window.clearTimeout(timer)
  }

  if (greetingDismissed) return

  const timer = window.setTimeout(() => setShowGreeting(true), 3000)
  return () => window.clearTimeout(timer)
}, [isOpen, greetingDismissed])

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowGreeting(false);
    setGreetingDismissed(true);
  };

  const handleBubbleClick = () => {
    setShowGreeting(false);
    setGreetingDismissed(true);
    onToggle();
  };

  return (
    <div className="relative flex flex-col items-end gap-3">
      {/* Greeting bubble */}
      <AnimatePresence>
        {showGreeting && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.93 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[78px] right-0 w-[280px] cursor-pointer"
            onClick={handleBubbleClick}
          >
            <div
              className="relative rounded-2xl p-5 overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #0d1530, #0a1128)",
                border: "1px solid rgba(99,102,241,0.3)",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* Top gradient accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(139,92,246,0.6), transparent)",
                }}
              />

              {/* Background glow */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-indigo-600/10 blur-2xl pointer-events-none" />

              {/* Dismiss */}
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss"
                className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#64748b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Bot header */}
              <div className="flex items-center gap-2.5 mb-3.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)",
                    boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
                  }}
                >
                  <BrandBotIcon size={16} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Kufu Assistant</p>
                  <p className="text-[0.65rem] text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    Online now
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div
                className="h-px mb-3.5"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />

              {/* Message */}
              <p className="text-[0.83rem] text-slate-300 leading-relaxed">
                👋 Hi! I know everything about this website.
              </p>
              <p className="text-[0.83rem] text-slate-400 leading-relaxed mt-1">
                Ask me about services, pricing, or anything else — I'll answer
                instantly.
              </p>

              {/* CTA row */}
              <div
                className="mt-4 flex items-center justify-between rounded-xl px-3.5 py-2.5"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                }}
              >
                <span className="text-[0.75rem] font-semibold text-indigo-300">
                  Start a conversation
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#818cf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>

              {/* Tail */}
              <div
                className="absolute -bottom-[9px] right-6 w-4 h-4 rotate-45"
                style={{
                  background: "#0d1530",
                  borderRight: "1px solid rgba(99,102,241,0.3)",
                  borderBottom: "1px solid rgba(99,102,241,0.3)",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        type="button"
        aria-controls="floating-chat-widget"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        onClick={onToggle}
        className="relative flex h-14 w-14 items-center justify-center rounded-full text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        style={{
          background: "linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)",
          boxShadow: isOpen
            ? "0 4px 20px rgba(99,102,241,0.4)"
            : "0 8px 32px rgba(99,102,241,0.55)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Pulse rings */}
        {!isOpen && !greetingDismissed && (
          <>
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              }}
            />
            <span className="absolute -inset-1.5 rounded-full border border-indigo-400/25 animate-pulse" />
          </>
        )}

        {/* Unread dot */}
        {showGreeting && !isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#020617]" />
        )}

        {/* Icon */}
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.18 }}
              className="relative z-10"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.18 }}
              className="relative z-10"
            >
              <BrandBotIcon size={20} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
