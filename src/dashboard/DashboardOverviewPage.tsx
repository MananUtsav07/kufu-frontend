import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { ApiError, getDashboardSummary, type DashboardSummary } from '../lib/api'
import { formatDateTime } from '../lib/utils'
import './DashboardOverviewPage.css'

const EMPTY_SUMMARY: DashboardSummary = {
  messages_used_this_period: 0,
  total_messages_lifetime: 0,
  plan: 'free',
  integrations_used: 0,
  integration_limit: 1,
  tickets_open: 0,
}

export function DashboardOverviewPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<DashboardSummary>(EMPTY_SUMMARY)
  const [recentSessions, setRecentSessions] = useState<Array<{ session_id: string; messages: Array<Record<string, unknown>> }>>([])

  useEffect(() => {
    let mounted = true

    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getDashboardSummary()
        if (!mounted) {
          return
        }

        setSummary(response.summary)
        setRecentSessions((response.recent_sessions ?? []) as Array<{ session_id: string; messages: Array<Record<string, unknown>> }>)
      } catch (loadError) {
        if (!mounted) {
          return
        }
        setError(loadError instanceof ApiError ? loadError.message : 'Failed to load dashboard summary.')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="dashboard-overview space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Dashboard</h1>
          <p className="text-sm text-slate-400">Usage, integrations, and recent chatbot sessions.</p>
        </div>
        <Link
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          to="/dashboard/integrations"
        >
          Manage Integrations
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Plan</p>
          <p className="mt-2 text-2xl font-black capitalize text-white">{loading ? '-' : summary.plan}</p>
        </div>
        <div className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Messages This Period</p>
          <p className="mt-2 text-2xl font-black text-white">
            {loading ? '-' : summary.messages_used_this_period.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Integrations Used</p>
          <p className="mt-2 text-2xl font-black text-white">
            {loading ? '-' : `${summary.integrations_used}/${summary.integration_limit}`}
          </p>
        </div>
        <div className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Open Tickets</p>
          <p className="mt-2 text-2xl font-black text-white">{loading ? '-' : summary.tickets_open}</p>
        </div>
      </div>

      <section className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-white">Recent Chat Sessions</h2>
          <span className="text-xs text-slate-400">Latest {recentSessions.length}</span>
        </div>

        <div className="space-y-3">
          {recentSessions.length === 0 ? (
            <p className="text-sm text-slate-400">{loading ? 'Loading sessions...' : 'No chat sessions yet.'}</p>
          ) : (
            recentSessions.map((session) => {
              const latestMessage = session.messages[0]
              const latestText =
                typeof latestMessage?.content === 'string'
                  ? latestMessage.content
                  : 'No content'
              const latestCreatedAt =
                typeof latestMessage?.created_at === 'string'
                  ? latestMessage.created_at
                  : null

              return (
                <div key={session.session_id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{session.session_id}</p>
                  <p className="mt-1 text-sm text-slate-200 line-clamp-2">{latestText}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {latestCreatedAt ? formatDateTime(latestCreatedAt) : 'Timestamp unavailable'}
                  </p>
                </div>
              )
            })
          )}
        </div>
      </section>
    </div>
  )
}
