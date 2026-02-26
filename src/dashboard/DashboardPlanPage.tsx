import { useAuth } from '../lib/auth-context'
import './DashboardPlanPage.css'

export function DashboardPlanPage() {
  const { client } = useAuth()

  return (
    <div className="dashboard-plan space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Plan</h1>
        <p className="text-sm text-slate-400">Current subscription and upgrade options.</p>
      </div>

      <section className="plan-card rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-6">
        <p className="text-xs uppercase tracking-wide text-indigo-300">Current Plan</p>
        <p className="mt-2 text-3xl font-black text-white">{client?.plan || 'starter'}</p>
        <p className="mt-3 text-sm text-slate-300">
          Starter includes lead capture, dashboard analytics, and knowledge editing.
        </p>

        <div className="mt-6 rounded-xl border border-indigo-500/35 bg-indigo-500/10 p-4">
          <p className="text-sm font-semibold text-indigo-100">Need more channels and automation flows?</p>
          <p className="mt-1 text-sm text-indigo-200/80">
            Upgrade CTA is frontend-only for now. Connect billing when payment backend is ready.
          </p>
          <button
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            type="button"
          >
            Contact Sales for Upgrade
          </button>
        </div>
      </section>
    </div>
  )
}
