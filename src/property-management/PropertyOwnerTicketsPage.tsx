import { useEffect, useState } from 'react'

import {
  ApiError,
  getPropertyOwnerTickets,
  patchPropertyOwnerTicketStatus,
  type PropertyTenantTicket,
} from '../lib/api'
import { PropertyEmptyState } from './components/PropertyEmptyState'
import { PropertyStatusBadge } from './components/PropertyStatusBadge'

const STATUS_OPTIONS: Array<PropertyTenantTicket['status']> = ['open', 'in_progress', 'resolved', 'closed']

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function PropertyOwnerTicketsPage() {
  const [tickets, setTickets] = useState<PropertyTenantTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null)

  const loadTickets = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getPropertyOwnerTickets()
      setTickets(response.tickets)
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Failed to load owner tickets.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTickets()
  }, [])

  const handleStatusChange = async (ticketId: string, status: PropertyTenantTicket['status']) => {
    setUpdatingTicketId(ticketId)
    setError(null)
    try {
      const response = await patchPropertyOwnerTicketStatus(ticketId, status)
      setTickets((current) =>
        current.map((ticket) => (ticket.id === response.ticket.id ? response.ticket : ticket)),
      )
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Failed to update ticket status.')
    } finally {
      setUpdatingTicketId(null)
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Ticket Management</h1>
        <p className="text-sm text-slate-400">Track and resolve tenant support issues.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-400">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <PropertyEmptyState title="No tickets found" description="Tenant support tickets will appear here when raised." />
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <article key={ticket.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-white">{ticket.subject}</h2>
                  <p className="text-xs text-slate-500">{formatDate(ticket.created_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <PropertyStatusBadge value={ticket.status} />
                  <select
                    className="rounded-lg border border-white/10 bg-slate-950/70 px-2 py-1 text-xs text-slate-100"
                    disabled={updatingTicketId === ticket.id}
                    value={ticket.status}
                    onChange={(event) =>
                      handleStatusChange(ticket.id, event.target.value as PropertyTenantTicket['status'])
                    }
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-200">{ticket.message}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
