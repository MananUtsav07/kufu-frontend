import { type FormEvent, useEffect, useState } from 'react'

import {
  ApiError,
  getDashboardTickets,
  patchDashboardTicket,
  postDashboardTicket,
  type DashboardTicket,
} from '../lib/api'
import { formatDateTime } from '../lib/utils'
import './DashboardSupportPage.css'

export function DashboardSupportPage() {
  const [tickets, setTickets] = useState<DashboardTicket[]>([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTickets = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getDashboardTickets()
      setTickets(response.tickets)
    } catch (loadError) {
      setError(loadError instanceof ApiError ? loadError.message : 'Failed to load tickets.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTickets()
  }, [])

  const submitTicket = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!subject.trim() || !message.trim()) {
      setError('Subject and message are required.')
      return
    }

    setSubmitting(true)
    try {
      const response = await postDashboardTicket({
        subject: subject.trim(),
        message: message.trim(),
      })

      setTickets((current) => [response.ticket, ...current])
      setSubject('')
      setMessage('')
    } catch (submitError) {
      setError(submitError instanceof ApiError ? submitError.message : 'Failed to create ticket.')
    } finally {
      setSubmitting(false)
    }
  }

  const closeTicket = async (ticketId: string) => {
    setError(null)
    try {
      const response = await patchDashboardTicket(ticketId, { status: 'closed' })
      setTickets((current) => current.map((item) => (item.id === ticketId ? response.ticket : item)))
    } catch (closeError) {
      setError(closeError instanceof ApiError ? closeError.message : 'Failed to close ticket.')
    }
  }

  return (
    <div className="dashboard-support space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Support</h1>
        <p className="text-sm text-slate-400">Raise tickets and track status updates.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <form className="support-form rounded-2xl border border-white/10 bg-slate-900/70 p-4" onSubmit={submitTicket}>
        <h2 className="text-sm font-semibold text-white">Create Ticket</h2>
        <div className="mt-3 space-y-3">
          <input
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
            placeholder="Ticket subject"
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
          <textarea
            className="min-h-[120px] rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
            placeholder="Describe your issue"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={submitting}
            type="submit"
          >
            {submitting ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </div>
      </form>

      <section className="support-list space-y-3">
        {loading ? (
          <p className="text-sm text-slate-400">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-sm text-slate-400">No tickets yet.</p>
        ) : (
          tickets.map((ticket) => (
            <article key={ticket.id} className="support-ticket rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{ticket.subject}</h3>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                    ticket.status === 'open'
                      ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border border-slate-500/40 bg-slate-500/10 text-slate-300'
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-300">{ticket.message}</p>
              {ticket.admin_response ? (
                <div className="mt-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-xs text-indigo-200">
                  <p className="font-semibold uppercase tracking-wide">Admin response</p>
                  <p className="mt-1 whitespace-pre-line">{ticket.admin_response}</p>
                </div>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-slate-500">Created: {formatDateTime(ticket.created_at)}</p>
                {ticket.status === 'open' ? (
                  <button
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/5"
                    type="button"
                    onClick={() => closeTicket(ticket.id)}
                  >
                    Close Ticket
                  </button>
                ) : null}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  )
}
