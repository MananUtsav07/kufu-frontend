import { useEffect, useState } from 'react'

import { ApiError, getAdminImpersonate, getAdminOverview, type AdminOverview } from '../lib/api'
import './AdminOverviewPage.css'

const EMPTY_OVERVIEW: AdminOverview = {
  total_users: 0,
  total_clients: 0,
  active_subscriptions_by_plan: {},
  total_messages_last_24h: 0,
  total_messages_last_7d: 0,
}

export function AdminOverviewPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [overview, setOverview] = useState<AdminOverview>(EMPTY_OVERVIEW)
  const [impersonateUserId, setImpersonateUserId] = useState('')
  const [impersonateResult, setImpersonateResult] = useState<unknown>(null)

  useEffect(() => {
    let mounted = true

    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getAdminOverview()
        if (!mounted) {
          return
        }
        setOverview(response.overview)
      } catch (loadError) {
        if (!mounted) {
          return
        }
        setError(loadError instanceof ApiError ? loadError.message : 'Failed to load admin overview.')
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
    <div className="admin-overview space-y-5">
      <div>
        <h2 className="font-display text-2xl font-black text-white sm:text-3xl">Overview</h2>
        <p className="text-sm text-slate-400">Platform-level metrics across all clients.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Users</p>
          <p className="mt-2 text-2xl font-black text-white">{loading ? '-' : overview.total_users}</p>
        </article>
        <article className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Clients</p>
          <p className="mt-2 text-2xl font-black text-white">{loading ? '-' : overview.total_clients}</p>
        </article>
        <article className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Messages (24h)</p>
          <p className="mt-2 text-2xl font-black text-white">{loading ? '-' : overview.total_messages_last_24h}</p>
        </article>
        <article className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Messages (7d)</p>
          <p className="mt-2 text-2xl font-black text-white">{loading ? '-' : overview.total_messages_last_7d}</p>
        </article>
      </div>

      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <h3 className="text-sm font-semibold text-white">Active subscriptions by plan</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(overview.active_subscriptions_by_plan).length === 0 ? (
            <span className="text-sm text-slate-400">No active subscriptions.</span>
          ) : (
            Object.entries(overview.active_subscriptions_by_plan).map(([planCode, count]) => (
              <span
                key={planCode}
                className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-200"
              >
                {planCode}: {count}
              </span>
            ))
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <h3 className="text-sm font-semibold text-white">Impersonate Client (Read Only)</h3>
        <p className="mt-1 text-xs text-slate-400">Enter user id to inspect linked user/client context.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
            placeholder="user uuid"
            type="text"
            value={impersonateUserId}
            onChange={(event) => setImpersonateUserId(event.target.value)}
          />
          <button
            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
            type="button"
            onClick={async () => {
              if (!impersonateUserId.trim()) {
                return
              }

              try {
                const result = await getAdminImpersonate(impersonateUserId.trim())
                setImpersonateResult(result)
              } catch (lookupError) {
                setImpersonateResult({
                  ok: false,
                  error: lookupError instanceof ApiError ? lookupError.message : 'Lookup failed',
                })
              }
            }}
          >
            Lookup
          </button>
        </div>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-slate-950/80 p-3 text-xs text-slate-300">
          {JSON.stringify(impersonateResult, null, 2)}
        </pre>
      </section>
    </div>
  )
}
