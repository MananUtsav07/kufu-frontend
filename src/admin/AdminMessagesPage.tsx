import { useEffect, useMemo, useState } from 'react'

import { ApiError, getAdminMessages, getAdminMessagesExportUrl } from '../lib/api'
import './AdminMessagesPage.css'

type AdminMessage = {
  id: string
  user_id: string
  chatbot_id: string
  session_id: string
  role: string
  content: string
  tokens_estimate: number
  created_at: string
}

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userIdFilter, setUserIdFilter] = useState('')
  const [chatbotIdFilter, setChatbotIdFilter] = useState('')

  const loadMessages = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getAdminMessages({
        limit: 100,
        offset: 0,
        user_id: userIdFilter.trim() || undefined,
        chatbot_id: chatbotIdFilter.trim() || undefined,
      })

      setMessages(response.messages as AdminMessage[])
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : 'Failed to load messages.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadMessages()
  }, [])

  const exportUrl = useMemo(
    () =>
      getAdminMessagesExportUrl({
        user_id: userIdFilter.trim() || undefined,
        chatbot_id: chatbotIdFilter.trim() || undefined,
      }),
    [chatbotIdFilter, userIdFilter],
  )

  return (
    <div className="admin-messages space-y-5">
      <div>
        <h2 className="font-display text-2xl font-black text-white sm:text-3xl">Messages Explorer</h2>
        <p className="text-sm text-slate-400">Inspect assistant and user messages across all clients.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
          <input
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
            placeholder="Filter by user_id"
            type="text"
            value={userIdFilter}
            onChange={(event) => setUserIdFilter(event.target.value)}
          />
          <input
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
            placeholder="Filter by chatbot_id"
            type="text"
            value={chatbotIdFilter}
            onChange={(event) => setChatbotIdFilter(event.target.value)}
          />
          <button
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            type="button"
            onClick={loadMessages}
          >
            Apply Filters
          </button>
          <a
            className="inline-flex items-center justify-center rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/5"
            href={exportUrl}
            rel="noreferrer"
            target="_blank"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/70">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Chatbot</th>
              <th className="px-4 py-3">Session</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Content</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan={6}>
                  Loading messages...
                </td>
              </tr>
            ) : messages.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-400" colSpan={6}>
                  No messages found.
                </td>
              </tr>
            ) : (
              messages.map((message) => (
                <tr key={message.id} className="border-b border-white/5 text-slate-200">
                  <td className="px-4 py-3 text-xs text-slate-400">{message.created_at}</td>
                  <td className="px-4 py-3 text-xs text-slate-300">{message.user_id}</td>
                  <td className="px-4 py-3 text-xs text-slate-300">{message.chatbot_id}</td>
                  <td className="px-4 py-3 text-xs text-slate-300">{message.session_id}</td>
                  <td className="px-4 py-3 text-xs uppercase text-indigo-200">{message.role}</td>
                  <td className="max-w-[360px] px-4 py-3 text-sm text-slate-200">{message.content}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
