import { useState } from 'react'

import { ApiError, postDashboardQuote } from '../lib/api'
import './DashboardUpgradePlanPage.css'

const PLANS = [
  { code: 'starter', title: 'Starter', description: '1000 messages/month, 1 integration' },
  { code: 'pro', title: 'Pro', description: '10000 messages/month, 1 integration' },
  { code: 'business', title: 'Business', description: 'Unlimited messages, up to 10 integrations' },
] as const

export function DashboardUpgradePlanPage() {
  const [submittingPlan, setSubmittingPlan] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const requestUpgrade = async (planCode: 'starter' | 'pro' | 'business') => {
    setSubmittingPlan(planCode)
    setError(null)
    setSuccess(null)

    try {
      await postDashboardQuote({
        requested_plan: planCode,
        requested_unlimited_messages: planCode === 'business',
        notes: `Upgrade request for ${planCode.toUpperCase()} plan from dashboard.`,
      })
      setSuccess(`Upgrade request sent for ${planCode.toUpperCase()} plan. Our team will review it shortly.`)
    } catch (submitError) {
      setError(submitError instanceof ApiError ? submitError.message : 'Failed to submit upgrade request.')
    } finally {
      setSubmittingPlan(null)
    }
  }

  return (
    <div className="dashboard-upgrade space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Upgrade Plan</h1>
        <p className="text-sm text-slate-400">Submit an upgrade request. Admin approval activates your new plan.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {success}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <article key={plan.code} className="upgrade-card rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <h2 className="text-lg font-bold text-white">{plan.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
            <button
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={submittingPlan === plan.code}
              type="button"
              onClick={() => requestUpgrade(plan.code)}
            >
              {submittingPlan === plan.code ? 'Submitting...' : `Request ${plan.title}`}
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
