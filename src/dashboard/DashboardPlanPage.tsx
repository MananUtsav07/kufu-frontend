import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { ApiError, getDashboardPlan, type Plan, type Subscription } from '../lib/api'
import './DashboardPlanPage.css'

export function DashboardPlanPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  useEffect(() => {
    let mounted = true

    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getDashboardPlan()
        if (!mounted) {
          return
        }
        setPlan(response.plan)
        setSubscription(response.subscription)
      } catch (loadError) {
        if (!mounted) {
          return
        }
        setError(loadError instanceof ApiError ? loadError.message : 'Failed to load plan.')
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

  const isUnlimited = plan?.monthly_message_cap == null

  return (
    <div className="dashboard-plan space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Your Plan</h1>
        <p className="text-sm text-slate-400">Current subscription usage and limits.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <section className="plan-card rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-6">
        <p className="text-xs uppercase tracking-wide text-indigo-300">Current Plan</p>
        <p className="mt-2 text-3xl font-black capitalize text-white">{loading ? '-' : plan?.code || 'free'}</p>
        <p className="mt-3 text-sm text-slate-300">
          {isUnlimited
            ? 'Unlimited monthly messages enabled for this account.'
            : `${plan?.monthly_message_cap ?? 0} messages per period.`}
        </p>

        <div className="mt-6 grid gap-3 rounded-xl border border-indigo-500/35 bg-indigo-500/10 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-indigo-200">Used This Period</p>
            <p className="mt-1 text-xl font-bold text-white">{subscription?.message_count_in_period ?? 0}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-indigo-200">Lifetime Messages</p>
            <p className="mt-1 text-xl font-bold text-white">{subscription?.total_message_count ?? 0}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-indigo-200">Period Start</p>
            <p className="mt-1 text-sm text-slate-100">{subscription?.current_period_start || '-'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-indigo-200">Period End</p>
            <p className="mt-1 text-sm text-slate-100">{subscription?.current_period_end || '-'}</p>
          </div>
        </div>

        <Link
          className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          to="/dashboard/upgrade"
        >
          Request Upgrade
        </Link>
      </section>
    </div>
  )
}
