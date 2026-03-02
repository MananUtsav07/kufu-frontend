import { type FormEvent, useEffect, useState } from 'react'

import { ApiError, getDashboardQuotes, postDashboardQuote, type DashboardQuote } from '../lib/api'
import { formatDateTime } from '../lib/utils'
import './DashboardCustomQuotePage.css'

export function DashboardCustomQuotePage() {
  const [quotes, setQuotes] = useState<DashboardQuote[]>([])
  const [requestedChatbots, setRequestedChatbots] = useState(1)
  const [requestedMonthlyMessages, setRequestedMonthlyMessages] = useState(500)
  const [requestedUnlimitedMessages, setRequestedUnlimitedMessages] = useState(false)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadQuotes = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getDashboardQuotes()
      setQuotes(response.quotes)
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : 'Failed to load custom quotes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadQuotes()
  }, [])

  const submitQuote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!notes.trim()) {
      setError('Please describe your requirements.')
      return
    }

    if (!requestedUnlimitedMessages && requestedMonthlyMessages < 1) {
      setError('Monthly messages must be at least 1 when unlimited is disabled.')
      return
    }

    setSubmitting(true)
    try {
      const response = await postDashboardQuote({
        requested_plan: null,
        requested_chatbots: requestedChatbots,
        requested_monthly_messages: requestedUnlimitedMessages ? undefined : requestedMonthlyMessages,
        requested_unlimited_messages: requestedUnlimitedMessages,
        notes: notes.trim(),
      })

      setQuotes((current) => [response.quote, ...current])
      setNotes('')
    } catch (submitError) {
      setError(submitError instanceof ApiError ? submitError.message : 'Failed to submit quote request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dashboard-custom-quote space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Custom Quote</h1>
        <p className="text-sm text-slate-400">Request custom integrations and message volume plans.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <form className="quote-form rounded-2xl border border-white/10 bg-slate-900/70 p-4" onSubmit={submitQuote}>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Requested Number of Chatbots</span>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
              min={1}
              type="number"
              value={requestedChatbots}
              onChange={(event) => setRequestedChatbots(Number(event.target.value || 1))}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Monthly Messages</span>
            <input
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
              disabled={requestedUnlimitedMessages}
              min={1}
              type="number"
              value={requestedMonthlyMessages}
              onChange={(event) => setRequestedMonthlyMessages(Number(event.target.value || 1))}
            />
          </label>
        </div>

        <label className="mt-3 flex items-center gap-2 text-sm text-slate-300">
          <input
            checked={requestedUnlimitedMessages}
            className="rounded border-white/20 bg-white/5"
            type="checkbox"
            onChange={(event) => setRequestedUnlimitedMessages(event.target.checked)}
          />
          Request unlimited monthly messages
        </label>

        <textarea
          className="mt-3 min-h-[120px] w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
          placeholder="Describe your requirements"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />

        <button
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={submitting}
          type="submit"
        >
          {submitting ? 'Submitting...' : 'Submit Custom Quote'}
        </button>
      </form>

      <section className="quote-list space-y-3">
        {loading ? (
          <p className="text-sm text-slate-400">Loading quote requests...</p>
        ) : quotes.length === 0 ? (
          <p className="text-sm text-slate-400">No custom quote requests yet.</p>
        ) : (
          quotes.map((quote) => (
            <article key={quote.id} className="quote-item rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">Custom request</p>
                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-200">
                  {quote.status}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-400">
                <p>Requested chatbots: {quote.requested_chatbots ?? '-'}</p>
                <p>
                  Monthly messages:{' '}
                  {quote.requested_unlimited_messages
                    ? 'Unlimited'
                    : quote.requested_monthly_messages?.toLocaleString('en-IN') ?? '-'}
                </p>
              </div>
              <p className="mt-2 text-sm text-slate-300">{quote.notes}</p>
              <p className="mt-2 text-xs text-slate-500">Created: {formatDateTime(quote.created_at)}</p>
              {quote.admin_response ? (
                <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">
                  <p className="font-semibold uppercase tracking-wide">Admin response</p>
                  <p className="mt-1 whitespace-pre-line">{quote.admin_response}</p>
                </div>
              ) : null}
            </article>
          ))
        )}
      </section>
    </div>
  )
}