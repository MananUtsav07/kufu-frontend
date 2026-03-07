import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  ApiError,
  getPropertyOwnerTenantDetail,
  type PropertyRentReminder,
  type PropertyTenantMessage,
  type PropertyTenantSessionUser,
  type PropertyTenantTicket,
} from '../lib/api'
import { PropertyEmptyState } from './components/PropertyEmptyState'
import { PropertyStatusBadge } from './components/PropertyStatusBadge'

type TenantDetailState = {
  tenant: PropertyTenantSessionUser
  property: {
    id: string
    owner_id: string
    property_name: string
    address: string
    unit_number: string | null
    created_at: string
  } | null
  tickets: PropertyTenantTicket[]
  reminders: PropertyRentReminder[]
  messages: PropertyTenantMessage[]
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function PropertyOwnerTenantDetailPage() {
  const { id } = useParams()
  const [detail, setDetail] = useState<TenantDetailState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const escalatedCount = useMemo(
    () => detail?.messages.filter((message) => message.escalated).length ?? 0,
    [detail],
  )

  useEffect(() => {
    if (!id) {
      setError('Tenant id is missing.')
      setLoading(false)
      return
    }

    let mounted = true
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getPropertyOwnerTenantDetail(id)
        if (mounted) {
          setDetail(response.detail)
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError instanceof ApiError ? requestError.message : 'Failed to load tenant detail.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })()

    return () => {
      mounted = false
    }
  }, [id])

  if (loading) {
    return <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-400">Loading tenant detail...</div>
  }

  if (error || !detail) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error || 'Tenant not found.'}</div>
        <Link className="text-sm font-semibold text-indigo-300 hover:text-indigo-200" to="/property-management/owner/tenants">
          Back to Tenants
        </Link>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-white sm:text-3xl">{detail.tenant.full_name}</h1>
          <p className="text-sm text-slate-400">
            {detail.tenant.email} • {detail.tenant.tenant_access_id}
          </p>
        </div>
        <Link
          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/5"
          to="/property-management/owner/tenants"
        >
          Back to Tenants
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Property</p>
          <p className="mt-1 font-semibold text-white">{detail.property?.property_name || '-'}</p>
          <p className="text-xs text-slate-400">{detail.property?.address || '-'}</p>
        </article>
        <article className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Rent</p>
          <p className="mt-1 font-semibold text-white">₹{Number(detail.tenant.monthly_rent).toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-400">Due day {detail.tenant.payment_due_day}</p>
        </article>
        <article className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Open Tickets</p>
          <p className="mt-1 font-semibold text-white">{detail.tickets.filter((ticket) => ticket.status === 'open').length}</p>
        </article>
        <article className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
          <p className="text-[11px] uppercase tracking-wide text-slate-500">Escalations</p>
          <p className="mt-1 font-semibold text-white">{escalatedCount}</p>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-white">Support Tickets</h2>
          {detail.tickets.length === 0 ? (
            <PropertyEmptyState title="No tickets" description="This tenant has not raised any support tickets yet." />
          ) : (
            <div className="mt-3 space-y-2">
              {detail.tickets.map((ticket) => (
                <article key={ticket.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
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
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-white">Rent Reminders</h2>
          {detail.reminders.length === 0 ? (
            <PropertyEmptyState title="No reminders" description="No reminder schedule available yet." />
          ) : (
            <div className="mt-3 space-y-2">
              {detail.reminders.map((reminder) => (
                <article key={reminder.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{reminder.reminder_type.replace(/_/g, ' ')}</p>
                    <PropertyStatusBadge value={reminder.status} />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Scheduled: {formatDate(reminder.scheduled_for)}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold text-white">Tenant Message Timeline</h2>
        {detail.messages.length === 0 ? (
          <PropertyEmptyState title="No chat messages" description="No tenant chat interactions have been recorded." />
        ) : (
          <ol className="mt-3 space-y-2">
            {detail.messages.map((entry) => (
              <li key={entry.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <PropertyStatusBadge value={entry.sender_type} />
                  {entry.intent ? <PropertyStatusBadge value={entry.intent} /> : null}
                  {entry.escalated ? (
                    <span className="inline-flex items-center rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-rose-200">
                      Escalated
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-slate-200">{entry.message}</p>
                <p className="mt-1 text-xs text-slate-500">{formatDate(entry.created_at)}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
