import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  ApiError,
  getDashboardKnowledge,
  getDashboardLeads,
  getDashboardMetrics,
  type DashboardKnowledge,
  type DashboardLead,
  type DashboardMetrics,
} from '../lib/api'
import { formatDateTime } from '../lib/utils'
import './DashboardOverviewPage.css'

const EMPTY_METRICS: DashboardMetrics = {
  total_leads: 0,
  leads_last_7_days: 0,
  number_of_chats: 0,
}

export function DashboardOverviewPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [metrics, setMetrics] = useState<DashboardMetrics>(EMPTY_METRICS)
  const [leads, setLeads] = useState<DashboardLead[]>([])
  const [knowledge, setKnowledge] = useState<DashboardKnowledge | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)

    void (async () => {
      try {
        const [metricsResponse, leadsResponse, knowledgeResponse] = await Promise.all([
          getDashboardMetrics(),
          getDashboardLeads({ limit: 5, offset: 0 }),
          getDashboardKnowledge(),
        ])

        if (!mounted) return
        setMetrics(metricsResponse.metrics)
        setLeads(leadsResponse.leads)
        setKnowledge(knowledgeResponse.knowledge)
      } catch (loadError) {
        if (!mounted) return
        setError(loadError instanceof ApiError ? loadError.message : 'Failed to load dashboard.')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="dashboard-overview space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Overview</h1>
          <p className="text-sm text-slate-400">Starter plan dashboard metrics and recent activity.</p>
        </div>
        <Link
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          to="/dashboard/knowledge"
        >
          Update Knowledge
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Total Leads</p>
          <p className="mt-2 text-3xl font-black text-white">
            {loading ? '-' : metrics.total_leads.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Leads Last 7 Days</p>
          <p className="mt-2 text-3xl font-black text-white">
            {loading ? '-' : metrics.leads_last_7_days.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:col-span-2 xl:col-span-1">
          <p className="text-xs uppercase tracking-wide text-slate-400">Number of Chats</p>
          <p className="mt-2 text-3xl font-black text-white">
            {loading ? '-' : metrics.number_of_chats.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white">Recent Leads</h2>
            <Link className="text-xs font-semibold text-indigo-300 hover:text-indigo-200" to="/dashboard/leads">
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-2 pr-3">Name</th>
                  <th className="pb-2 pr-3">Email / Phone</th>
                  <th className="pb-2 pr-3">Status</th>
                  <th className="pb-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td className="py-4 text-slate-400" colSpan={4}>
                      {loading ? 'Loading leads...' : 'No leads yet for this client.'}
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="border-t border-white/5 text-slate-200">
                      <td className="py-2.5 pr-3">{lead.name || 'Unknown'}</td>
                      <td className="py-2.5 pr-3 text-slate-300">{lead.email || lead.phone || '-'}</td>
                      <td className="py-2.5 pr-3">
                        <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-200">
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-400">{formatDateTime(lead.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="overview-card rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white">Knowledge Snapshot</h2>
            <Link className="text-xs font-semibold text-indigo-300 hover:text-indigo-200" to="/dashboard/knowledge">
              Edit
            </Link>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Services</p>
              <p className="mt-1 text-slate-200">
                {knowledge?.services_text?.trim() || 'No services text saved yet.'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Pricing</p>
              <p className="mt-1 text-slate-200">
                {knowledge?.pricing_text?.trim() || 'No pricing text saved yet.'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">FAQs</p>
              <p className="mt-1 text-slate-200">{Array.isArray(knowledge?.faqs_json) ? knowledge?.faqs_json.length : 0} items</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
