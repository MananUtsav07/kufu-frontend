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
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [isTyping, messages])

  useEffect(() => {
    if (!isMenuOpen) return
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isMenuOpen])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draft.trim()) return
    sendMessage(draft)
    setDraft('')
  }

  const widgetClassName =
    mode === 'embedded'
      ? 'flex h-full w-full flex-col overflow-hidden rounded-2xl'
      : 'flex h-[560px] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl'

  return (
    <motion.section
      id={panelId}
      className={`${widgetClassName} ${className}`.trim()}
      aria-label="Kufu Assistant Chat"
      style={{
        background: 'linear-gradient(145deg, rgba(8,14,32,0.99), rgba(6,10,26,0.98))',
        border: '1px solid rgba(99,102,241,0.2)',
        boxShadow: mode === 'floating'
          ? '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)'
          : 'none',
      }}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.08), transparent)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)',
              boxShadow: '0 2px 10px rgba(99,102,241,0.4)',
            }}
          >
            <BrandBotIcon size={15} />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none mb-1">Kufu Assistant</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[0.62rem] font-medium text-emerald-400 uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            aria-label="More actions"
            onClick={() => setIsMenuOpen((v) => !v)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                className="absolute right-0 top-10 z-20 min-w-36 rounded-xl p-1"
                style={{
                  background: 'rgba(12,18,42,0.98)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 8px_28px rgba(0,0,0,0.5)',
                }}
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => { clearChat(); setIsMenuOpen(false) }}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                  Clear chat
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: 'none' }}>
        <AnimatePresence initial={false}>
          {messages.map((message) => {
            const isUser = message.role === 'user'
            return (
              <motion.div
                key={message.id}
                className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Avatar */}
                {!isUser && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                  >
                    <BrandBotIcon size={12} />
                  </div>
                )}

                {/* Bubble */}
                <div
                  className="max-w-[78%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line"
                  style={
                    isUser
                      ? {
                          background: 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)',
                          borderRadius: '18px 18px 4px 18px',
                          color: 'white',
                          boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                        }
                      : {
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: '18px 18px 18px 4px',
                          color: '#cbd5e1',
                        }
                  }
                >
                  {message.content}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Typing indicator */}
     
<AnimatePresence>
  {isTyping && messages[messages.length - 1]?.role === 'user' && (
    <motion.div
      className="flex items-end gap-2.5"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.18 }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
      >
        <BrandBotIcon size={12} />
      </div>
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-[18px_18px_18px_4px]"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-slate-400"
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </motion.div>
  )}
</AnimatePresence>

        <div ref={endRef} />
      </div>

      {/* Bottom */}
      <div
        className="flex-shrink-0 p-3 space-y-2.5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(6,10,26,0.8)' }}
      >
        {/* Quick replies */}
        {quickReplies.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
            {quickReplies.map((reply) => (
              <button
                key={reply.label}
                type="button"
                disabled={isTyping}
                onClick={() => sendMessage(reply.message)}
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-indigo-300 hover:text-white transition-colors flex-shrink-0 disabled:opacity-50"
                style={{
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
              >
                {reply.label}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-xs text-red-300"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
            >
              <span className="truncate">{error}</span>
              <button
                type="button"
                onClick={retryLastResponse}
                className="flex-shrink-0 rounded-lg px-2.5 py-1 font-semibold text-red-200 hover:bg-red-500/20 transition-colors"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-xl px-4 py-2"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <label className="sr-only" htmlFor={`chat-input-${mode}`}>Type a message</label>
          <input
            ref={inputRef}
            id={`chat-input-${mode}`}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
            placeholder="Type a message…"
            disabled={isTyping}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={isTyping || !draft.trim()}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
            style={{
              background: draft.trim()
                ? 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)'
                : 'rgba(255,255,255,0.05)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>

        {/* Powered by */}
        <p className="text-center text-[0.6rem] text-slate-700">
          Powered by <span className="text-slate-600 font-semibold">Kufu</span>
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </motion.section>
  )
}