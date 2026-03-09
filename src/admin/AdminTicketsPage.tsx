import { useCallback, useEffect, useState } from 'react'

import { ApiError, getAdminTickets, patchAdminTicket, type DashboardTicket } from '../lib/api'
import './AdminTicketsPage.css'

export function AdminTicketsPage() {
  const pageSize = 50
  const [tickets, setTickets] = useState<DashboardTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [responseMap, setResponseMap] = useState<Record<string, string>>({})
  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all')

  const loadTickets = useCallback(
    async (nextOffset: number) => {
      setLoading(true)
      setError(null)
      try {
        const response = await getAdminTickets({
          limit: pageSize,
          offset: nextOffset,
          status: statusFilter === 'all' ? undefined : statusFilter,
        })
        setTickets(response.tickets)
        setOffset(nextOffset)
        setTotal(response.pagination.total)
        setResponseMap(
          response.tickets.reduce<Record<string, string>>((acc, ticket) => {
            acc[ticket.id] = ticket.admin_response || ''
            return acc
          }, {}),
        )
      } catch (loadError) {
        setError(loadError instanceof ApiError ? loadError.message : 'Failed to load tickets.')
      } finally {
        setLoading(false)
      }
    },
    [pageSize, statusFilter],
  )

  useEffect(() => {
    void loadTickets(0)
  }, [loadTickets])

  const updateTicket = async (ticket: DashboardTicket, status: 'open' | 'closed') => {
    setError(null)
    try {
      const response = await patchAdminTicket(ticket.id, {
        status,
        admin_response: responseMap[ticket.id] || undefined,
      })

      setTickets((current) => current.map((item) => (item.id === ticket.id ? response.ticket : item)))
    } catch (updateError) {
      setError(updateError instanceof ApiError ? updateError.message : 'Failed to update ticket.')
    }
  }

  return (
    <div className="admin-tickets space-y-5">
      <div>
        <h2 className="font-display text-2xl font-black text-white sm:text-3xl">Tickets</h2>
        <p className="text-sm text-slate-400">Respond to client support tickets and close issues.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs uppercase tracking-wide text-slate-400" htmlFor="ticket-status-filter">
            Status
          </label>
          <select
            id="ticket-status-filter"
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | 'open' | 'closed')}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-400">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="text-sm text-slate-400">No tickets found.</p>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <article key={ticket.id} className="ticket-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
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
              <textarea
                className="mt-3 min-h-[84px] w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
                placeholder="Write admin response"
                value={responseMap[ticket.id] || ''}
                onChange={(event) =>
                  setResponseMap((current) => ({
                    ...current,
                    [ticket.id]: event.target.value,
                  }))
                }
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/5"
                  type="button"
                  onClick={() => updateTicket(ticket, 'open')}
                >
                  Save as Open
                </button>
                <button
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
                  type="button"
                  onClick={() => updateTicket(ticket, 'closed')}
                >
                  Respond & Close
                </button>
              </div>
            </article>
          ))}
          <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
            <p>
              Showing {tickets.length === 0 ? 0 : offset + 1}-{offset + tickets.length} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                className="rounded-lg border border-white/10 px-2.5 py-1.5 text-slate-300 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading || offset === 0}
                type="button"
                onClick={() => {
                  const previousOffset = Math.max(0, offset - pageSize)
                  void loadTickets(previousOffset)
                }}
              >
                Previous
              </button>
              <button
                className="rounded-lg border border-white/10 px-2.5 py-1.5 text-slate-300 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading || offset + tickets.length >= total}
                type="button"
                onClick={() => {
                  const nextOffset = offset + pageSize
                  void loadTickets(nextOffset)
                }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
