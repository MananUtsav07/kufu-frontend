import { useEffect, useState } from 'react'

import { ApiError, getPropertyTenantDashboardSummary } from '../lib/api'
import { PropertyMetricCard } from './components/PropertyMetricCard'
import { PropertyStatusBadge } from './components/PropertyStatusBadge'
import { useTenantAuth } from './tenant-auth-context'

type TenantSummaryState = {
  openTickets: number
  recentMessages: number
  pendingReminders: number
  paymentStatus: 'pending' | 'paid' | 'overdue' | 'partial'
  monthlyRent: number
  dueDay: number
}

export function PropertyTenantOverviewPage() {
  const { token, tenant, property } = useTenantAuth()
  const [summary, setSummary] = useState<TenantSummaryState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    let mounted = true
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getPropertyTenantDashboardSummary(token)
        if (mounted) {
          setSummary(response.summary)
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError instanceof ApiError ? requestError.message : 'Failed to load tenant summary.')
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
  }, [token])

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Tenant Dashboard</h1>
        <p className="text-sm text-slate-400">{property?.property_name || 'Property support center'}</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
      ) : null}

      {loading || !summary ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-400">Loading your summary...</div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <PropertyMetricCard label="Open Tickets" value={summary.openTickets} />
            <PropertyMetricCard label="Recent Chat Messages" value={summary.recentMessages} />
            <PropertyMetricCard label="Pending Reminders" value={summary.pendingReminders} />
            <PropertyMetricCard
              label="Monthly Rent"
              value={`₹${Number(summary.monthlyRent).toLocaleString('en-IN')}`}
              hint={`Due on day ${summary.dueDay}`}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Payment Status</p>
            <div className="mt-2">
              <PropertyStatusBadge value={summary.paymentStatus} />
            </div>
            <p className="mt-3 text-sm text-slate-300">
              Welcome, {tenant?.full_name}. Use the chat tab for instant help or raise a ticket for maintenance and billing issues.
            </p>
          </div>
        </>
      )}
    </section>
  )
}
