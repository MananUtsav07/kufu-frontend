import { motion } from 'framer-motion'

type FloatingChatButtonProps = {
  isOpen: boolean
  onToggle: () => void
}

export function FloatingChatButton({ isOpen, onToggle }: FloatingChatButtonProps) {
  return (
    <motion.button
      className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark"
      type="button"
      aria-controls="floating-chat-widget"
      aria-expanded={isOpen}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      onClick={onToggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="material-symbols-outlined text-2xl">{isOpen ? 'close' : 'chat_bubble'}</span>
      {!isOpen ? (
        <span className="absolute -right-1 -top-1 flex h-4 w-4" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-blue-500" />
        </span>
      ) : null}
    </motion.button>
  )
}
