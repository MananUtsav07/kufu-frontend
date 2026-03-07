import { useEffect, useState } from 'react'

import {
  ApiError,
  getPropertyTenantTickets,
  postPropertyTenantTicket,
  type PropertyTenantTicket,
} from '../lib/api'
import { PropertyEmptyState } from './components/PropertyEmptyState'
import { PropertyStatusBadge } from './components/PropertyStatusBadge'
import { useTenantAuth } from './tenant-auth-context'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function PropertyTenantTicketsPage() {
  const { token } = useTenantAuth()
  const [tickets, setTickets] = useState<PropertyTenantTicket[]>([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTickets = async () => {
    if (!token) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await getPropertyTenantTickets(token)
      setTickets(response.tickets)
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Failed to load tenant tickets.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTickets()
  }, [token])

  const handleCreateTicket = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) {
      return
    }

    setSaving(true)
    setError(null)
    try {
      const response = await postPropertyTenantTicket(token, {
        subject,
        message,
      })
      setTickets((current) => [response.ticket, ...current])
      setSubject('')
      setMessage('')
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Failed to raise support ticket.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Support Tickets</h1>
        <p className="text-sm text-slate-400">Raise maintenance or billing issues for owner support.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
      ) : null}

      <form className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4" onSubmit={handleCreateTicket}>
        <h2 className="text-sm font-semibold text-white">Raise Ticket</h2>
        <input
          className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
          placeholder="Subject"
          required
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        />
        <textarea
          className="min-h-[120px] w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
          placeholder="Describe your issue"
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button
          className="rounded-lg border border-indigo-500/35 bg-indigo-500/20 px-3 py-2 text-sm font-semibold text-indigo-100 transition-colors hover:bg-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={saving}
          type="submit"
        >
          {saving ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-400">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <PropertyEmptyState title="No tickets yet" description="Your ticket history will appear here once submitted." />
      ) : (
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <article key={ticket.id} className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-white">{ticket.subject}</p>
                <PropertyStatusBadge value={ticket.status} />
              </div>
              <p className="mt-1 text-sm text-slate-300">{ticket.message}</p>
              <p className="mt-1 text-xs text-slate-500">{formatDate(ticket.created_at)}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
