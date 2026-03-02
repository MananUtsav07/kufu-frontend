import { type FormEvent, useState } from 'react'

import './ChatbotTester.css'

type TesterRole = 'user' | 'assistant'

type TesterMessage = {
  id: string
  role: TesterRole
  content: string
}

type ChatbotTesterProps = {
  disabled?: boolean
  sendingLabel?: string
  onSendMessage: (messages: Array<{ role: TesterRole; content: string }>) => Promise<string>
}

function createMessageId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function ChatbotTester({ disabled = false, sendingLabel = 'Thinking...', onSendMessage }: ChatbotTesterProps) {
  const [messages, setMessages] = useState<TesterMessage[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const content = draft.trim()
    if (!content || disabled || sending) {
      return
    }

    setError(null)
    setSending(true)

    const userMessage: TesterMessage = {
      id: createMessageId(),
      role: 'user',
      content,
    }

    const historyForRequest = [...messages, userMessage].map((message) => ({
      role: message.role,
      content: message.content,
    }))

    setMessages((current) => [...current, userMessage])
    setDraft('')

    try {
      const reply = await onSendMessage(historyForRequest)
      const assistantMessage: TesterMessage = {
        id: createMessageId(),
        role: 'assistant',
        content: reply,
      }
      setMessages((current) => [...current, assistantMessage])
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Failed to send test message.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="chatbot-tester space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-5">
      <div className="rounded-xl border border-white/10 bg-slate-950/80 p-3">
        <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Preview Chat</p>
        <div className="tester-messages-scroll max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <p className="text-sm text-slate-400">Send a message to test how your chatbot responds with current knowledge.</p>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={[
                    'max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm',
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'border border-white/10 bg-white/[0.05] text-slate-100',
                  ].join(' ')}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
          {sending ? <p className="text-xs text-slate-400">{sendingLabel}</p> : null}
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>
      ) : null}

      <form className="flex items-center gap-2" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          disabled={disabled || sending}
          placeholder="Type a test message..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={disabled || sending || !draft.trim()}
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  )
}
