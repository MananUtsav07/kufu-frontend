import { useEffect, useMemo, useState } from 'react'

import {
  ApiError,
  getDashboardLeads,
  patchDashboardLeadStatus,
  type DashboardLead,
} from '../lib/api'
import { exportCsv, formatDateTime } from '../lib/utils'
import './DashboardLeadsPage.css'

const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'closed'] as const
const PAGE_SIZE = 20

export function DashboardLeadsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [offset, setOffset] = useState(0)
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null)
  const [leads, setLeads] = useState<DashboardLead[]>([])
  const [total, setTotal] = useState(0)

  const canGoPrevious = offset > 0
  const canGoNext = offset + PAGE_SIZE < total

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    void (async () => {
      try {
        const response = await getDashboardLeads({
          limit: PAGE_SIZE,
          offset,
          status: statusFilter || undefined,
        })
        if (!mounted) return
        setLeads(response.leads)
        setTotal(response.pagination.total)
      } catch (loadError) {
        if (!mounted) return
        setError(loadError instanceof ApiError ? loadError.message : 'Failed to load leads.')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })()

    return () => {
      mounted = false
    }
  }, [offset, statusFilter])

  const pageLabel = useMemo(() => {
    if (total === 0) {
      return '0 of 0'
    }
    const start = offset + 1
    const end = Math.min(offset + PAGE_SIZE, total)
    return `${start}-${end} of ${total}`
  }, [offset, total])

  const handleExport = () => {
    exportCsv(
      `kufu-leads-${Date.now()}.csv`,
      leads.map((lead) => ({
        id: lead.id,
        name: lead.name ?? '',
        email: lead.email ?? '',
        phone: lead.phone ?? '',
        need: lead.need ?? '',
        status: lead.status,
        source: lead.source ?? '',
        created_at: lead.created_at,
      })),
    )
  }

  const handleStatusUpdate = async (leadId: string, nextStatus: string) => {
    setUpdatingLeadId(leadId)
    setError(null)
    try {
      const response = await patchDashboardLeadStatus(leadId, nextStatus)
      setLeads((current) =>
        current.map((lead) => (lead.id === leadId ? response.lead : lead)),
      )
    } catch (updateError) {
      setError(updateError instanceof ApiError ? updateError.message : 'Failed to update lead status.')
    } finally {
      setUpdatingLeadId(null)
    }
  }

  return (
    <div className="dashboard-leads space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Leads</h1>
          <p className="text-sm text-slate-400">Manage captured leads for your client workspace.</p>
        </div>
        <button
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={leads.length === 0}
          type="button"
          onClick={handleExport}
        >
          Export CSV
        </button>
      </div>

      <div className="leads-toolbar flex flex-wrap items-end gap-3 rounded-xl border border-white/10 bg-slate-900/70 p-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
            Status
          </span>
          <select
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value)
              setOffset(0)
            }}
          >
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="leads-table-card overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/70">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Need</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-slate-400" colSpan={6}>
                  {loading ? 'Loading leads...' : 'No leads found for this filter.'}
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-b border-white/5 text-slate-200">
                  <td className="px-4 py-3">{lead.name || 'Unknown'}</td>
                  <td className="px-4 py-3">{lead.email || '-'}</td>
                  <td className="px-4 py-3">{lead.phone || '-'}</td>
                  <td className="max-w-[220px] px-4 py-3 text-slate-300">{lead.need || '-'}</td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-100 focus:border-indigo-500/60 focus:outline-none"
                      disabled={updatingLeadId === lead.id}
                      value={lead.status}
                      onChange={(event) => handleStatusUpdate(lead.id, event.target.value)}
                    >
                      {LEAD_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{formatDateTime(lead.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-300">
        <span>{pageLabel}</span>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-white/10 px-3 py-1.5 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canGoPrevious}
            type="button"
            onClick={() => setOffset((current) => Math.max(0, current - PAGE_SIZE))}
          >
            Previous
          </button>
          <button
            className="rounded-lg border border-white/10 px-3 py-1.5 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canGoNext}
            type="button"
            onClick={() => setOffset((current) => current + PAGE_SIZE)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
