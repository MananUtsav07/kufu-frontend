import { useMemo } from 'react'

import { useAuth } from '../lib/auth-context'
import './DashboardProfilePage.css'

export function DashboardProfilePage() {
  const { user, client } = useAuth()

  const initials = useMemo(() => {
    if (!user?.email) {
      return '?'
    }
    return user.email.charAt(0).toUpperCase()
  }, [user?.email])

  return (
    <div className="dashboard-profile space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Profile</h1>
        <p className="text-sm text-slate-400">Account and business details for this dashboard user.</p>
      </div>

      <section className="profile-card rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="profile-avatar flex h-14 w-14 items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-500/20 text-xl font-black text-indigo-100">
            {initials}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{user?.email || 'No user loaded'}</p>
            <p className="text-sm text-slate-400">Plan: {client?.plan || 'starter'}</p>
          </div>
        </div>
      </section>

      <section className="profile-card rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Business Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Business Name
            </span>
            <input
              className="profile-input h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100"
              disabled
              type="text"
              value={client?.businessName || ''}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Website URL
            </span>
            <input
              className="profile-input h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100"
              disabled
              type="text"
              value={client?.websiteUrl || ''}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Email
            </span>
            <input
              className="profile-input h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100"
              disabled
              type="email"
              value={user?.email || ''}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Plan
            </span>
            <input
              className="profile-input h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100"
              disabled
              type="text"
              value={client?.plan || 'starter'}
            />
          </label>
        </div>

        <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          Business profile update endpoint is not enabled yet on backend. Fields are read-only for now.
        </p>
      </section>
    </div>
  )
}
