import type { DashboardAnalyticsResponse } from '../../lib/api'

import './AnalyticsCards.css'

type AnalyticsCardsProps = {
  analytics: DashboardAnalyticsResponse | null
  loading?: boolean
}

export function AnalyticsCards({ analytics, loading = false }: AnalyticsCardsProps) {
  const totalChats = analytics?.totalChats ?? 0
  const popularQuestions = analytics?.popularQuestions ?? []
  const peakHours = analytics?.peakHours ?? []

  return (
    <div className="analytics-cards space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Chats</p>
          <p className="mt-2 text-2xl font-black text-white">{loading ? '-' : totalChats.toLocaleString('en-IN')}</p>
          <p className="mt-1 text-xs text-slate-500">Distinct visitor sessions</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:col-span-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">Peak Usage Hours (UTC)</p>
          {loading ? (
            <p className="mt-2 text-sm text-slate-400">Loading analytics...</p>
          ) : peakHours.length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">No chat sessions yet.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {peakHours.map((item) => (
                <span
                  key={`hour-${item.hour}`}
                  className="inline-flex rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-200"
                >
                  {item.hour.toString().padStart(2, '0')}:00 - {item.count}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <h2 className="text-sm font-semibold text-white">Most Frequently Asked Questions</h2>
        {loading ? (
          <p className="mt-2 text-sm text-slate-400">Loading questions...</p>
        ) : popularQuestions.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">No question data available.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {popularQuestions.map((item, index) => (
              <li
                key={`${item.question}-${index}`}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="leading-6">{item.question}</p>
                  <span className="whitespace-nowrap rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                    {item.count}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}