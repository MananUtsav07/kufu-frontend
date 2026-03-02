import { useEffect, useState } from 'react'

import { ChatbotTester } from './components/ChatbotTester'
import {
  ApiError,
  getDashboardChatbots,
  postDashboardTestChat,
} from '../lib/api'

import './DashboardTestChatPage.css'

export function DashboardTestChatPage() {
  const [loadingChatbots, setLoadingChatbots] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chatbots, setChatbots] = useState<Array<{ id: string; name: string }>>([])
  const [selectedChatbotId, setSelectedChatbotId] = useState('')
  const [sessionId, setSessionId] = useState(() => `dashboard-test-${Date.now()}`)

  useEffect(() => {
    let active = true

    void (async () => {
      setLoadingChatbots(true)
      setError(null)
      try {
        const response = await getDashboardChatbots()
        if (!active) {
          return
        }

        const list = response.chatbots.map((chatbot) => ({
          id: chatbot.id,
          name: chatbot.name,
        }))
        setChatbots(list)
        setSelectedChatbotId((current) => {
          if (current && list.some((item) => item.id === current)) {
            return current
          }
          return list[0]?.id ?? ''
        })
      } catch (loadError) {
        if (!active) {
          return
        }
        setError(loadError instanceof ApiError ? loadError.message : 'Failed to load chatbots.')
      } finally {
        if (active) {
          setLoadingChatbots(false)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [])

  const handleSendMessage = async (messages: Array<{ role: 'user' | 'assistant'; content: string }>) => {
    if (!selectedChatbotId) {
      throw new Error('Select a chatbot first.')
    }

    const trimmedHistory = messages.slice(-12)
    const response = await postDashboardTestChat(selectedChatbotId, {
      sessionId,
      messages: trimmedHistory,
    })

    return response.reply
  }

  const resetSession = () => {
    setSessionId(`dashboard-test-${Date.now()}`)
  }

  return (
    <div className="dashboard-test-chat space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Test Chat</h1>
        <p className="text-sm text-slate-400">
          Preview responses with live knowledge retrieval. Test messages do not consume plan quota.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Chatbot</span>
            <select
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
              disabled={loadingChatbots || chatbots.length === 0}
              value={selectedChatbotId}
              onChange={(event) => setSelectedChatbotId(event.target.value)}
            >
              {chatbots.length === 0 ? <option value="">No chatbot</option> : null}
              {chatbots.map((chatbot) => (
                <option key={chatbot.id} value={chatbot.id}>
                  {chatbot.name}
                </option>
              ))}
            </select>
          </label>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Session</p>
            <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300">
              {sessionId}
            </p>
          </div>

          <button
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/5"
            type="button"
            onClick={resetSession}
          >
            New Session
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      ) : null}

      <ChatbotTester
        key={`${selectedChatbotId}:${sessionId}`}
        disabled={!selectedChatbotId || loadingChatbots}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}
