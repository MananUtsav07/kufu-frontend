import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BrandBotIcon } from './BrandBotIcon'

type FloatingChatButtonProps = {
  isOpen: boolean
  onToggle: () => void
}

export function FloatingChatButton({ isOpen, onToggle }: FloatingChatButtonProps) {
  const [playIntroBounce, setPlayIntroBounce] = useState(true)
  const [showOnlineHint, setShowOnlineHint] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPlayIntroBounce(false)
    }, 1100)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      setShowOnlineHint(false)
      return
    }

    const timer = window.setTimeout(() => {
      setShowOnlineHint(false)
    }, 6000)

    return () => {
      window.clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <div className="relative">
      <AnimatePresence>
        {!isOpen && showOnlineHint ? (
          <motion.div
            className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-full border border-emerald-400/30 bg-slate-900/95 px-3 py-1.5 text-xs font-medium text-emerald-200 shadow-[0_10px_24px_rgba(2,6,23,0.5)]"
            initial={{ opacity: 0, x: 10, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            I am online and here to help
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        className="group relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_14px_34px_rgba(99,102,241,0.5)] transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        type="button"
        aria-controls="floating-chat-widget"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        onClick={onToggle}
        initial={{ y: 0, scale: 1 }}
        animate={
          isOpen || !playIntroBounce
            ? { y: 0, scale: 1 }
            : { y: [0, -10, 0, -6, 0], scale: [1, 1.02, 1] }
        }
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
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
    </div>
  )
}
