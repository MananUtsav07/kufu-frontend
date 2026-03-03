import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { RequireChatbot } from '../components/RequireChatbot'
import { useAuth } from '../lib/auth-context'
import { formatDateTime } from '../lib/utils'
import {
  ApiError,
  getChatbotByUser,
  getDashboardChatHistory,
  searchDashboardChatHistory,
  type DashboardChatHistoryRow,
} from '../lib/api'

import './DashboardChatHistoryPage.css'

type LeadFilter = 'all' | 'yes' | 'no'

type AppliedFilters = {
  from?: string
  to?: string
  leadCaptured?: 'yes' | 'no'
  searchText?: string
}

type VisitorHistoryItem = {
  visitorId: string
  latestAt: string
  lastUserMessage: string
  messageCount: number
  hadLeadCapture: boolean
}

const HISTORY_FETCH_LIMIT = 200

export function DashboardChatHistoryPage() {
  const { plan, isAdmin, user } = useAuth()
  const hasChatHistoryAccess = useMemo(() => {
    if (isAdmin) {
      return true
    }

    const planCode = typeof plan?.code === 'string' ? plan.code.toLowerCase() : ''
    return planCode === 'starter' || planCode === 'pro' || planCode === 'business'
  }, [isAdmin, plan?.code])

  const [loadingChatbots, setLoadingChatbots] = useState(true)
  const [loadingRows, setLoadingRows] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accessDenied, setAccessDenied] = useState(false)

  const [chatbots, setChatbots] = useState<Array<{ id: string; name: string }>>([])
  const [hasChatbot, setHasChatbot] = useState(false)
  const [selectedChatbotId, setSelectedChatbotId] = useState('')
  const [selectedVisitorId, setSelectedVisitorId] = useState('')

  const [fromInput, setFromInput] = useState('')
  const [toInput, setToInput] = useState('')
  const [leadInput, setLeadInput] = useState<LeadFilter>('all')
  const [searchInput, setSearchInput] = useState('')
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({})

  const [rows, setRows] = useState<DashboardChatHistoryRow[]>([])

  useEffect(() => {
    let active = true

    if (!hasChatHistoryAccess || !user?.id) {
      setLoadingChatbots(false)
      setChatbots([])
      setHasChatbot(false)
      setSelectedChatbotId('')
      return () => {
        active = false
      }
    }

    void (async () => {
      setLoadingChatbots(true)
      setError(null)
      try {
        const response = await getChatbotByUser(user.id)
        if (!active) {
          return
        }

        const list = response.chatbots.map((chatbot) => ({
          id: chatbot.id,
          name: chatbot.name,
        }))

        setHasChatbot(response.hasChatbot)
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
  }, [hasChatHistoryAccess, user?.id])

  useEffect(() => {
    let active = true

    if (!selectedChatbotId) {
      setRows([])
      return
    }

    if (!hasChatHistoryAccess) {
      setAccessDenied(true)
      setRows([])
      return
    }

    if (!hasChatbot) {
      setAccessDenied(false)
      setRows([])
      return
    }

    void (async () => {
      setLoadingRows(true)
      setError(null)
      setAccessDenied(false)

      try {
        const isSearchMode = Boolean(appliedFilters.searchText?.trim())
        const response = isSearchMode
          ? await searchDashboardChatHistory({
              chatbotId: selectedChatbotId,
              q: appliedFilters.searchText ?? '',
              from: appliedFilters.from,
              to: appliedFilters.to,
              leadCaptured: appliedFilters.leadCaptured,
              limit: HISTORY_FETCH_LIMIT,
              offset: 0,
            })
          : await getDashboardChatHistory(selectedChatbotId, {
              from: appliedFilters.from,
              to: appliedFilters.to,
              leadCaptured: appliedFilters.leadCaptured,
              limit: HISTORY_FETCH_LIMIT,
              offset: 0,
            })

        if (!active) {
          return
        }

        setRows(response.rows)
      } catch (loadError) {
        if (!active) {
          return
        }

        if (loadError instanceof ApiError && loadError.status === 403) {
          setAccessDenied(true)
          setRows([])
          return
        }

        setError(loadError instanceof ApiError ? loadError.message : 'Failed to load chat history.')
      } finally {
        if (active) {
          setLoadingRows(false)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [appliedFilters, hasChatHistoryAccess, hasChatbot, selectedChatbotId])

  const visitors = useMemo<VisitorHistoryItem[]>(() => {
    const grouped = new Map<string, VisitorHistoryItem>()

    for (const row of rows) {
      const existing = grouped.get(row.visitor_id)
      if (!existing) {
        grouped.set(row.visitor_id, {
          visitorId: row.visitor_id,
          latestAt: row.created_at,
          lastUserMessage: row.user_message,
          messageCount: 1,
          hadLeadCapture: row.lead_captured,
        })
        continue
      }

      existing.messageCount += 1
      existing.hadLeadCapture = existing.hadLeadCapture || row.lead_captured
    }

    return Array.from(grouped.values())
  }, [rows])

  useEffect(() => {
    setSelectedVisitorId((current) => {
      if (current && visitors.some((item) => item.visitorId === current)) {
        return current
      }
      return visitors[0]?.visitorId ?? ''
    })
  }, [visitors])

  const selectedVisitorRows = useMemo(() => {
    if (!selectedVisitorId) {
      return []
    }

    return rows
      .filter((row) => row.visitor_id === selectedVisitorId)
      .sort(
        (left, right) =>
          new Date(left.created_at).getTime() - new Date(right.created_at).getTime(),
      )
  }, [rows, selectedVisitorId])

  const applyFilters = () => {
    const nextFilters: AppliedFilters = {}

    if (fromInput) {
      nextFilters.from = new Date(`${fromInput}T00:00:00.000Z`).toISOString()
    }
    if (toInput) {
      nextFilters.to = new Date(`${toInput}T23:59:59.999Z`).toISOString()
    }
    if (leadInput !== 'all') {
      nextFilters.leadCaptured = leadInput
    }
    if (searchInput.trim()) {
      nextFilters.searchText = searchInput.trim()
    }

    setAppliedFilters(nextFilters)
  }

  const clearFilters = () => {
    setFromInput('')
    setToInput('')
    setLeadInput('all')
    setSearchInput('')
    setAppliedFilters({})
  }

  return (
    <div className="dashboard-chat-history space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Chat History</h1>
        <p className="text-sm text-slate-400">
          Browse visitors first, then open each visitor conversation timeline.
        </p>
      </div>

      {accessDenied ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <p>Chat history is available on Starter and above.</p>
          <Link
            className="mt-2 inline-flex rounded-md border border-amber-400/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-100 hover:bg-amber-500/20"
            to="/dashboard/upgrade"
          >
            Upgrade Plan
          </Link>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {!accessDenied ? (
        loadingChatbots ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-400">
            Loading chatbots...
          </div>
        ) : (
          <RequireChatbot hasChatbot={hasChatbot}>
            <div className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="grid gap-3 lg:grid-cols-[1fr_repeat(4,minmax(0,1fr))_auto_auto]">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Chatbot</span>
                    <select
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
                      disabled={loadingChatbots || chatbots.length === 0}
                      value={selectedChatbotId}
                      onChange={(event) => {
                        setSelectedChatbotId(event.target.value)
                        setSelectedVisitorId('')
                      }}
                    >
                      {chatbots.length === 0 ? <option value="">No chatbot</option> : null}
                      {chatbots.map((chatbot) => (
                        <option key={chatbot.id} value={chatbot.id}>
                          {chatbot.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">From</span>
                    <input
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
                      type="date"
                      value={fromInput}
                      onChange={(event) => setFromInput(event.target.value)}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">To</span>
                    <input
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
                      type="date"
                      value={toInput}
                      onChange={(event) => setToInput(event.target.value)}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Lead</span>
                    <select
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
                      value={leadInput}
                      onChange={(event) => setLeadInput(event.target.value as LeadFilter)}
                    >
                      <option value="all">All</option>
                      <option value="yes">Captured</option>
                      <option value="no">Not Captured</option>
                    </select>
                  </label>

                  <label className="block lg:col-span-2">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Search</span>
                    <input
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
                      placeholder="Search visitor message or bot response"
                      type="text"
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                    />
                  </label>

                  <button
                    className="self-end rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
                    type="button"
                    onClick={applyFilters}
                  >
                    Apply
                  </button>

                  <button
                    className="self-end rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/5"
                    type="button"
                    onClick={clearFilters}
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
                <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">Visitors</p>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-slate-300">
                      {visitors.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {loadingRows ? (
                      <p className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-6 text-center text-sm text-slate-400">
                        Loading visitors...
                      </p>
                    ) : visitors.length === 0 ? (
                      <p className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-6 text-center text-sm text-slate-400">
                        No visitors found for the selected filters.
                      </p>
                    ) : (
                      visitors.map((visitor) => (
                        <button
                          key={visitor.visitorId}
                          className={`w-full rounded-xl border px-3 py-2 text-left transition-colors ${
                            selectedVisitorId === visitor.visitorId
                              ? 'border-indigo-500/40 bg-indigo-500/15'
                              : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
                          }`}
                          type="button"
                          onClick={() => setSelectedVisitorId(visitor.visitorId)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate font-mono text-[11px] text-slate-200">{visitor.visitorId}</p>
                            <span className="text-[10px] text-slate-500">{visitor.messageCount} msgs</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-400">{visitor.lastUserMessage}</p>
                          <p className="mt-1 text-[11px] text-slate-500">{formatDateTime(visitor.latestAt)}</p>
                        </button>
                      ))
                    )}
                  </div>
                </section>

                <section className="rounded-2xl border border-white/10 bg-slate-900/70">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Conversation</p>
                      <p className="font-mono text-[11px] text-slate-400">{selectedVisitorId || 'Select a visitor'}</p>
                    </div>
                  </div>

                  <div className="max-h-[640px] space-y-3 overflow-y-auto p-4">
                    {loadingRows ? (
                      <p className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-6 text-center text-sm text-slate-400">
                        Loading conversation...
                      </p>
                    ) : !selectedVisitorId ? (
                      <p className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-6 text-center text-sm text-slate-400">
                        Select a visitor to view chat history.
                      </p>
                    ) : selectedVisitorRows.length === 0 ? (
                      <p className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-6 text-center text-sm text-slate-400">
                        No chat messages found for this visitor.
                      </p>
                    ) : (
                      selectedVisitorRows.map((row) => (
                        <article key={row.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                          <div className="rounded-lg bg-indigo-500/10 p-3">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-200">Visitor</p>
                            <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-100">{row.user_message}</p>
                          </div>

                          <div className="mt-2 rounded-lg border border-white/10 bg-slate-950/70 p-3">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Assistant</p>
                            <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-300">{row.bot_response}</p>
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-slate-500">
                            <span
                              className={`inline-flex rounded-full border px-2 py-0.5 font-semibold ${
                                row.lead_captured
                                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                                  : 'border-slate-500/40 bg-slate-500/10 text-slate-300'
                              }`}
                            >
                              {row.lead_captured ? 'Lead Captured' : 'No Lead'}
                            </span>
                            <span>{formatDateTime(row.created_at)}</span>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              </div>
            </div>
          </RequireChatbot>
        )
      ) : null}
    </div>
  )
}
