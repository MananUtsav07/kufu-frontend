import { useEffect, useState } from 'react'

import { AnalyticsCards } from './components/AnalyticsCards'
import {
  ApiError,
  getDashboardAnalytics,
  getDashboardChatbots,
  type DashboardAnalyticsResponse,
} from '../lib/api'

import './DashboardAnalyticsPage.css'

type AnalyticsFilters = {
  from?: string
  to?: string
}

export function DashboardAnalyticsPage() {
  const [loadingChatbots, setLoadingChatbots] = useState(true)
  const [loadingAnalytics, setLoadingAnalytics] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accessDenied, setAccessDenied] = useState(false)

  const [chatbots, setChatbots] = useState<Array<{ id: string; name: string }>>([])
  const [selectedChatbotId, setSelectedChatbotId] = useState('')

  const [fromInput, setFromInput] = useState('')
  const [toInput, setToInput] = useState('')
  const [appliedFilters, setAppliedFilters] = useState<AnalyticsFilters>({})

  const [analytics, setAnalytics] = useState<DashboardAnalyticsResponse | null>(null)

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
      setAnalytics(null)
      return
    }

    void (async () => {
      setLoadingAnalytics(true)
      setError(null)
      setAccessDenied(false)

      try {
        const response = await getDashboardAnalytics(selectedChatbotId, {
          from: appliedFilters.from,
          to: appliedFilters.to,
        })

        if (!active) {
          return
        }

        setAnalytics({
          totalChats: response.totalChats,
          popularQuestions: response.popularQuestions,
          peakHours: response.peakHours,
        })
      } catch (loadError) {
        if (!active) {
          return
        }

        if (loadError instanceof ApiError && loadError.status === 403) {
          setAccessDenied(true)
          setAnalytics(null)
          return
        }

        setError(loadError instanceof ApiError ? loadError.message : 'Failed to load analytics.')
      } finally {
        if (active) {
          setLoadingAnalytics(false)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [appliedFilters, selectedChatbotId])

  const applyFilters = () => {
    const next: AnalyticsFilters = {}
    if (fromInput) {
      next.from = new Date(`${fromInput}T00:00:00.000Z`).toISOString()
    }
    if (toInput) {
      next.to = new Date(`${toInput}T23:59:59.999Z`).toISOString()
    }
    setAppliedFilters(next)
  }

  return (
    <div className="dashboard-analytics space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Analytics</h1>
        <p className="text-sm text-slate-400">Track total chats, frequent questions, and peak usage hours.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_repeat(2,minmax(0,1fr))_auto]">
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

          <button
            className="self-end rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            type="button"
            onClick={applyFilters}
          >
            Apply
          </button>
        </div>
      </div>

      {accessDenied ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Analytics is available only on Pro and Business plans.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      ) : null}

      <AnalyticsCards analytics={analytics} loading={loadingAnalytics} />
    </div>
  )
}