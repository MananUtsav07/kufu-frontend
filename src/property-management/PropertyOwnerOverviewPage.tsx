import { useEffect, useState } from 'react'

import { ApiError, getPropertyOwnerDashboardSummary, type PropertyOwnerSummary } from '../lib/api'
import { PropertyMetricCard } from './components/PropertyMetricCard'

const DEFAULT_SUMMARY: PropertyOwnerSummary = {
  activeTenants: 0,
  openTickets: 0,
  overdueRent: 0,
  escalatedChats: 0,
  remindersPending: 0,
}

export function PropertyOwnerOverviewPage() {
  const [summary, setSummary] = useState<PropertyOwnerSummary>(DEFAULT_SUMMARY)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getPropertyOwnerDashboardSummary()
        if (mounted) {
          setSummary(response.summary)
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError instanceof ApiError ? requestError.message : 'Failed to load owner summary.')
        }
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
    <section className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Owner Overview</h1>
        <p className="text-sm text-slate-400">Quick operational metrics for your properties.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-400">Loading dashboard summary...</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <PropertyMetricCard label="Active Tenants" value={summary.activeTenants} />
          <PropertyMetricCard label="Open Tickets" value={summary.openTickets} />
          <PropertyMetricCard label="Overdue Rent" value={summary.overdueRent} />
          <PropertyMetricCard label="Escalated Chats" value={summary.escalatedChats} />
          <PropertyMetricCard label="Reminders Pending" value={summary.remindersPending} />
        </div>
      )}
    </section>
  )
}
