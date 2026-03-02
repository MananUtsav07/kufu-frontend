import { useEffect, useMemo, useState } from 'react'

import { ChatHistoryTable } from './components/ChatHistoryTable'
import {
  ApiError,
  getDashboardChatbots,
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

const PAGE_SIZE = 20

export function DashboardChatHistoryPage() {
  const [loadingChatbots, setLoadingChatbots] = useState(true)
  const [loadingRows, setLoadingRows] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accessDenied, setAccessDenied] = useState(false)

  const [chatbots, setChatbots] = useState<Array<{ id: string; name: string }>>([])
  const [selectedChatbotId, setSelectedChatbotId] = useState('')

  const [fromInput, setFromInput] = useState('')
  const [toInput, setToInput] = useState('')
  const [leadInput, setLeadInput] = useState<LeadFilter>('all')
  const [searchInput, setSearchInput] = useState('')

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({})
  const [offset, setOffset] = useState(0)

  const [rows, setRows] = useState<DashboardChatHistoryRow[]>([])
  const [total, setTotal] = useState(0)

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

  useEffect(() => {
    let active = true

    if (!selectedChatbotId) {
      setRows([])
      setTotal(0)
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
              limit: PAGE_SIZE,
              offset,
            })
          : await getDashboardChatHistory(selectedChatbotId, {
              from: appliedFilters.from,
              to: appliedFilters.to,
              leadCaptured: appliedFilters.leadCaptured,
              limit: PAGE_SIZE,
              offset,
            })

        if (!active) {
          return
        }

        setRows(response.rows)
        setTotal(response.pagination.total)
      } catch (loadError) {
        if (!active) {
          return
        }

        if (loadError instanceof ApiError && loadError.status === 403) {
          setAccessDenied(true)
          setRows([])
          setTotal(0)
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
  }, [appliedFilters, offset, selectedChatbotId])

  const canGoPrevious = offset > 0
  const canGoNext = offset + PAGE_SIZE < total

  const pageLabel = useMemo(() => {
    if (total === 0) {
      return '0 of 0'
    }
    const start = offset + 1
    const end = Math.min(offset + PAGE_SIZE, total)
    return `${start}-${end} of ${total}`
  }, [offset, total])

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

    setOffset(0)
    setAppliedFilters(nextFilters)
  }

  const clearFilters = () => {
    setFromInput('')
    setToInput('')
    setLeadInput('all')
    setSearchInput('')
    setOffset(0)
    setAppliedFilters({})
  }

  return (
    <div className="dashboard-chat-history space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Chat History</h1>
        <p className="text-sm text-slate-400">Review visitor conversations, lead capture status, and timestamps.</p>
      </div>

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
                setOffset(0)
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

      {accessDenied ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Chat history is available on Starter and above. Upgrade your plan to access this section.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      ) : null}

      <ChatHistoryTable rows={rows} loading={loadingRows} />

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-300">
        <span>{pageLabel}</span>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-white/10 px-3 py-1.5 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canGoPrevious || loadingRows}
            type="button"
            onClick={() => setOffset((current) => Math.max(0, current - PAGE_SIZE))}
          >
            Previous
          </button>
          <button
            className="rounded-lg border border-white/10 px-3 py-1.5 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canGoNext || loadingRows}
            type="button"
            onClick={() => setOffset((current) => current + PAGE_SIZE)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}