import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { brandChatLogoSrc } from '../lib/brand'
import { useChat } from '../lib/chat-context'
import '../styles/components/chat-widget.css'

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

  const widgetClassName = mode === 'embedded' ? 'kufu-chat-shell' : 'kufu-chat-shell-floating'

  return (
    <motion.section
      id={panelId}
      className={`${widgetClassName} ${className}`.trim()}
      aria-label="Kufu Assistant Chat"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="kufu-chat-header">
        <div className="kufu-chat-header-left">
          <div className="kufu-chat-bot-avatar">
            <img alt="Kufu logo" className="kufu-chat-bot-avatar-image" src={brandChatLogoSrc} />
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
            className="kufu-chat-menu-button"
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
                className="kufu-chat-menu-panel"
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

      <div className="kufu-chat-body">
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isUser = message.role === 'user'

            return (
              <motion.div
                key={message.id}
                className={`kufu-chat-message-row ${isUser ? 'kufu-chat-message-row-user' : ''}`.trim()}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className={`kufu-chat-message-avatar ${
                    isUser ? 'kufu-chat-message-avatar-user' : 'kufu-chat-message-avatar-assistant'
                  }`}
                >
                  {isUser ? (
                    <span className="material-symbols-outlined text-sm text-slate-300">person</span>
                  ) : (
                    <img alt="Kufu logo" className="h-4 w-4 object-contain" src={brandChatLogoSrc} />
                  )}
                </div>
                <div
                  className={`kufu-chat-bubble ${isUser ? 'kufu-chat-bubble-user' : 'kufu-chat-bubble-assistant'}`}
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
              className="kufu-chat-typing"
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

      <div className="kufu-chat-footer">
        <div className="kufu-chat-quick-replies">
          {quickReplies.map((reply) => (
            <button
              key={reply.label}
              className="kufu-chat-quick-reply"
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
              className="kufu-chat-error"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
            >
              <span className="truncate">{error}</span>
              <button className="kufu-chat-error-retry" type="button" onClick={retryLastResponse}>
                Retry
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <form className="kufu-chat-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor={`chat-input-${mode}`}>
            Type a message
          </label>
          <input
            id={`chat-input-${mode}`}
            className="kufu-chat-input"
            placeholder="Type a message..."
            disabled={isTyping}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button className="kufu-chat-send" type="submit" aria-label="Send message" disabled={isTyping}>
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>
      </div>
    </motion.section>
  )
}

