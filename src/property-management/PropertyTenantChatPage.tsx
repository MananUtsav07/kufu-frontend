import { useEffect, useMemo, useState } from 'react'

import {
  ApiError,
  getPropertyTenantMessages,
  postPropertyTenantChat,
  type PropertyTenantMessage,
} from '../lib/api'
import { PropertyEmptyState } from './components/PropertyEmptyState'
import { PropertyStatusBadge } from './components/PropertyStatusBadge'
import { useTenantAuth } from './tenant-auth-context'

function formatTime(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  }).format(new Date(value))
}

export function PropertyTenantChatPage() {
  const { token } = useTenantAuth()
  const [messages, setMessages] = useState<PropertyTenantMessage[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const escalatedCount = useMemo(
    () => messages.filter((message) => message.escalated).length,
    [messages],
  )

  const loadMessages = async () => {
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await getPropertyTenantMessages(token)
      setMessages(response.messages)
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Failed to load messages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadMessages()
  }, [token])

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token || !draft.trim()) {
      return
    }

    const localMessage = draft.trim()
    setDraft('')
    setSending(true)
    setError(null)

    try {
      const response = await postPropertyTenantChat(token, { message: localMessage })
      await loadMessages()

      if (!response.reply) {
        setError('No response from assistant.')
      }
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Failed to send message.')
      setDraft(localMessage)
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-black text-white sm:text-3xl">AI Support Chat</h1>
          <p className="text-sm text-slate-400">Get quick answers about maintenance, rent, and lease queries.</p>
        </div>
        <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-rose-200">
          Escalations: {escalatedCount}
        </span>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        {loading ? (
          <div className="text-sm text-slate-400">Loading chat timeline...</div>
        ) : messages.length === 0 ? (
          <PropertyEmptyState title="No messages yet" description="Start a conversation with support assistant." />
        ) : (
          <ol className="space-y-2">
            {messages.map((message) => (
              <li key={message.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <PropertyStatusBadge value={message.sender_type} />
                  {message.intent ? <PropertyStatusBadge value={message.intent} /> : null}
                  {message.escalated ? (
                    <span className="inline-flex items-center rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-rose-200">
                      Escalated
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-slate-200">{message.message}</p>
                <p className="mt-1 text-xs text-slate-500">{formatTime(message.created_at)}</p>
              </li>
            ))}
          </ol>
        )}
      </div>

      <form className="rounded-2xl border border-white/10 bg-slate-900/60 p-4" onSubmit={handleSend}>
        <label className="mb-2 block text-xs uppercase tracking-wide text-slate-400">Ask support assistant</label>
        <div className="flex gap-2">
          <input
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
            placeholder="Type your issue..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button
            className="rounded-lg border border-indigo-500/35 bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-100 transition-colors hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={sending}
            type="submit"
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </section>
  )
}
