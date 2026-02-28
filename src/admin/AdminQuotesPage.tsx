import { useEffect, useState } from 'react'

import { ApiError, getAdminQuotes, patchAdminQuote, type DashboardQuote } from '../lib/api'
import './AdminQuotesPage.css'

const PLAN_OPTIONS = ['free', 'starter', 'pro', 'business'] as const

export function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<DashboardQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [responseMap, setResponseMap] = useState<Record<string, string>>({})
  const [planMap, setPlanMap] = useState<Record<string, 'free' | 'starter' | 'pro' | 'business'>>({})

  const loadQuotes = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getAdminQuotes()
      setQuotes(response.quotes)
      setResponseMap(
        response.quotes.reduce<Record<string, string>>((acc, quote) => {
          acc[quote.id] = quote.admin_response || ''
          return acc
        }, {}),
      )
      setPlanMap(
        response.quotes.reduce<Record<string, 'free' | 'starter' | 'pro' | 'business'>>((acc, quote) => {
          acc[quote.id] = (quote.requested_plan as 'free' | 'starter' | 'pro' | 'business') || 'starter'
          return acc
        }, {}),
      )
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : 'Failed to load quote requests.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadQuotes()
  }, [])

  const updateQuote = async (quote: DashboardQuote, status: 'responded' | 'closed' | 'approved') => {
    setError(null)
    try {
      const response = await patchAdminQuote(quote.id, {
        status,
        admin_response: responseMap[quote.id] || undefined,
        approve_plan: status === 'approved' ? planMap[quote.id] : undefined,
      })

      setQuotes((current) => current.map((item) => (item.id === quote.id ? response.quote : item)))
    } catch (updateError) {
      setError(updateError instanceof ApiError ? updateError.message : 'Failed to update quote.')
    }
  }

  return (
    <div className="admin-quotes space-y-5">
      <div>
        <h2 className="font-display text-2xl font-black text-white sm:text-3xl">Quotes & Upgrades</h2>
        <p className="text-sm text-slate-400">Respond to custom quote requests and approve upgrades.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-400">Loading quote requests...</p>
      ) : quotes.length === 0 ? (
        <p className="text-sm text-slate-400">No quote requests found.</p>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <article key={quote.id} className="quote-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">User: {quote.user_id}</p>
                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-200">
                  {quote.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-300">{quote.notes}</p>
              <p className="mt-2 text-xs text-slate-500">
                Requested plan: {quote.requested_plan || '-'} | Requested chatbots: {quote.requested_chatbots || '-'}
              </p>

              <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
                <textarea
                  className="min-h-[84px] w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
                  placeholder="Write response"
                  value={responseMap[quote.id] || ''}
                  onChange={(event) =>
                    setResponseMap((current) => ({
                      ...current,
                      [quote.id]: event.target.value,
                    }))
                  }
                />
                <select
                  className="h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-slate-100"
                  value={planMap[quote.id] || 'starter'}
                  onChange={(event) =>
                    setPlanMap((current) => ({
                      ...current,
                      [quote.id]: event.target.value as 'free' | 'starter' | 'pro' | 'business',
                    }))
                  }
                >
                  {PLAN_OPTIONS.map((planCode) => (
                    <option key={planCode} value={planCode}>
                      {planCode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/5"
                  type="button"
                  onClick={() => updateQuote(quote, 'responded')}
                >
                  Respond
                </button>
                <button
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-200 transition-colors hover:bg-amber-500/20"
                  type="button"
                  onClick={() => updateQuote(quote, 'closed')}
                >
                  Close
                </button>
                <button
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
                  type="button"
                  onClick={() => updateQuote(quote, 'approved')}
                >
                  Approve Plan
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
