import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { ApiError, getWidgetConfig, streamChat } from '../lib/api'
import './WidgetPage.css'

type WidgetMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function WidgetPage() {
  const [searchParams] = useSearchParams()
  const key = searchParams.get('key')?.trim() || ''

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [businessName, setBusinessName] = useState('Kufu')
  const [messages, setMessages] = useState<WidgetMessage[]>([])

  const sessionId = useMemo(() => `widget-${Date.now()}`, [])

  useEffect(() => {
    let mounted = true

    if (!key) {
      setError('Widget key is missing.')
      setLoading(false)
      return
    }

    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getWidgetConfig(key)
        if (!mounted) {
          return
        }

        setBusinessName(response.config.business_name)
        setMessages([{ id: createId(), role: 'assistant', content: response.config.greeting }])
      } catch (loadError) {
        if (!mounted) {
          return
        }
        setError(loadError instanceof ApiError ? loadError.message : 'Failed to load widget config.')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })()

    return () => {
      mounted = false
    }
  }, [key])

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draft.trim() || sending || !key) {
      return
    }

    const userMessage: WidgetMessage = {
      id: createId(),
      role: 'user',
      content: draft.trim(),
    }

    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setDraft('')
    setSending(true)
    setError(null)

    const assistantMessageId = createId()
    setMessages((current) => [...current, { id: assistantMessageId, role: 'assistant', content: '' }])

    try {
      await streamChat(
        {
          key,
          sessionId,
          messages: nextMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          metadata: {
            page: '/widget',
            key,
          },
        },
        {
          onToken: (token) => {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantMessageId
                  ? { ...message, content: `${message.content}${token}` }
                  : message,
              ),
            )
          },
        },
        { auth: false },
      )
    } catch (chatError) {
      setError(chatError instanceof ApiError ? chatError.message : 'Failed to send message.')
      setMessages((current) => current.filter((message) => message.id !== assistantMessageId))
    } finally {
      setSending(false)
    }
  }

  const closeWidget = () => {
    window.parent?.postMessage({ type: 'kufu_widget_close' }, '*')
  }

  return (
    <div className="widget-page flex h-screen flex-col bg-slate-950 text-slate-100">
      <header className="widget-header flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">{businessName} Assistant</p>
          <p className="text-xs text-slate-400">Powered by Kufu</p>
        </div>
        <button
          className="rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-300 transition-colors hover:bg-white/5"
          type="button"
          onClick={closeWidget}
        >
          Close
        </button>
      </header>

      <main className="widget-messages flex-1 space-y-3 overflow-y-auto p-4">
        {loading ? <p className="text-sm text-slate-400">Loading widget...</p> : null}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[82%] whitespace-pre-line rounded-xl px-3 py-2 text-sm ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'border border-white/10 bg-white/[0.04] text-slate-100'
              }`}
            >
              {message.content || (sending && message.role === 'assistant' ? '...' : '')}
            </div>
          </div>
        ))}
      </main>

      {error ? (
        <div className="border-t border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-300">{error}</div>
      ) : null}

      <form className="widget-input border-t border-white/10 p-3" onSubmit={sendMessage}>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
          <input
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            disabled={sending || !key}
            placeholder="Type a message..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={sending || !key}
            type="submit"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
