import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { BrandBotIcon } from './BrandBotIcon'
import { useChat } from '../lib/chat-context'

type ChatWidgetProps = {
  mode?: 'floating' | 'embedded'
  className?: string
  panelId?: string
}

export function ChatWidget({ mode = 'embedded', className = '', panelId }: ChatWidgetProps) {
  const { clearChat, error, isTyping, messages, quickReplies, retryLastResponse, sendMessage } = useChat()

  const [draft, setDraft] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [isTyping, messages])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current) {
        return
      }

      if (!menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isMenuOpen])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    sendMessage(draft)
    setDraft('')
  }

  const widgetClassName =
    mode === 'embedded'
      ? 'flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl'
      : 'flex h-[560px] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-900/95 shadow-[0_24px_64px_rgba(0,0,0,0.55)]'

  return (
    <motion.section
      id={panelId}
      className={`${widgetClassName} ${className}`.trim()}
      aria-label="Kufu Assistant Chat"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-transparent p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-black">
            <BrandBotIcon size={16} />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Kufu Assistant</p>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-medium uppercase tracking-tight text-slate-400">AI Active</span>
            </div>
          </div>
        </div>
        <div ref={menuRef} className="relative">
          <button
            className="text-slate-400 hover:text-white"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            aria-label="More actions"
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="material-symbols-outlined">more_horiz</span>
          </button>

          <AnimatePresence>
            {isMenuOpen ? (
              <motion.div
                className="absolute right-0 top-8 z-20 min-w-36 rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-xl"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
              >
                <button
                  className="w-full rounded-md px-3 py-2 text-left text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800"
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    clearChat()
                    setIsMenuOpen(false)
                  }}
                >
                  Clear chat
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isUser = message.role === 'user'

            return (
              <motion.div
                key={message.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`.trim()}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                    isUser ? 'bg-slate-700' : 'bg-black'
                  }`}
                >
                  {isUser ? (
                    <span className="material-symbols-outlined text-sm text-slate-300">person</span>
                  ) : (
                    <BrandBotIcon size={13} />
                  )}
                </div>
                <div
                  className={`max-w-[80%] whitespace-pre-line rounded-xl p-3 text-sm leading-relaxed ${
                    isUser
                      ? 'rounded-tr-none bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_8px_20px_rgba(99,102,241,0.25)]'
                      : 'rounded-tl-none border border-white/10 bg-slate-800/90 text-slate-100'
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        <AnimatePresence>
          {isTyping ? (
            <motion.div
              className="flex items-center gap-1.5 pl-11"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.16 }}
            >
              <div className="size-1 animate-pulse rounded-full bg-slate-500" />
              <div className="size-1 animate-pulse rounded-full bg-slate-500 delay-75" />
              <div className="size-1 animate-pulse rounded-full bg-slate-500 delay-150" />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div ref={endRef} />
      </div>

      <div className="space-y-4 border-t border-white/10 bg-slate-900 p-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickReplies.map((reply) => (
            <button
              key={reply.label}
              className="whitespace-nowrap rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-200 transition-colors hover:bg-indigo-500/20"
              type="button"
              disabled={isTyping}
              onClick={() => sendMessage(reply.message)}
            >
              {reply.label}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {error ? (
            <motion.div
              className="flex items-center justify-between gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-xs text-red-300"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
            >
              <span className="truncate">{error}</span>
              <button
                className="shrink-0 rounded-md bg-red-500/20 px-2 py-1 font-medium text-red-200 hover:bg-red-500/30"
                type="button"
                onClick={retryLastResponse}
              >
                Retry
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <form className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2 pl-4" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor={`chat-input-${mode}`}>
            Type a message
          </label>
          <input
            id={`chat-input-${mode}`}
            className="flex-1 border-none bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:ring-0"
            placeholder="Type a message..."
            disabled={isTyping}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button
            className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white"
            type="submit"
            aria-label="Send message"
            disabled={isTyping}
          >
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
      </div>
    </motion.section>
  )
}

