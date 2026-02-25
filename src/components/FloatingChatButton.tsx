import { motion } from 'framer-motion'
import { BrandBotIcon } from './BrandBotIcon'

type FloatingChatButtonProps = {
  isOpen: boolean
  onToggle: () => void
}

export function FloatingChatButton({ isOpen, onToggle }: FloatingChatButtonProps) {
  return (
    <motion.button
      className="group relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_14px_34px_rgba(99,102,241,0.5)] transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
      type="button"
      aria-controls="floating-chat-widget"
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      onClick={onToggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      {!isOpen ? (
        <>
          <span
            className="pointer-events-none absolute inset-[-8px] rounded-full bg-gradient-to-br from-indigo-500/35 to-violet-500/35 blur-md"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-[-6px] rounded-full border border-indigo-300/35 animate-pulse"
            aria-hidden
          />
        </>
      ) : null}

      {isOpen ? (
        <span className="material-symbols-outlined relative z-10 text-2xl">close</span>
      ) : (
        <span className="relative z-10">
          <BrandBotIcon size={20} />
        </span>
      )}
    </motion.button>
  )
}
