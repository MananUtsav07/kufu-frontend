import type { DashboardChatHistoryRow } from '../../lib/api'
import { formatDateTime } from '../../lib/utils'

import './ChatHistoryTable.css'

type ChatHistoryTableProps = {
  rows: DashboardChatHistoryRow[]
  loading?: boolean
  emptyMessage?: string
}

export function ChatHistoryTable({ rows, loading = false, emptyMessage = 'No conversations found.' }: ChatHistoryTableProps) {
  return (
    <div className="chat-history-table overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/70">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-400">
            <th className="px-4 py-3">Visitor Message</th>
            <th className="px-4 py-3">Bot Response</th>
            <th className="px-4 py-3">Lead Status</th>
            <th className="px-4 py-3">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-10 text-center text-slate-400" colSpan={4}>
                {loading ? 'Loading chat history...' : emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-b border-white/5 align-top text-slate-200">
                <td className="max-w-[280px] px-4 py-3 text-slate-100">
                  <p className="line-clamp-3 whitespace-pre-wrap break-words">{row.user_message}</p>
                </td>
                <td className="max-w-[360px] px-4 py-3 text-slate-300">
                  <p className="line-clamp-4 whitespace-pre-wrap break-words">{row.bot_response}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      'inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold',
                      row.lead_captured
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                        : 'border-slate-500/40 bg-slate-500/10 text-slate-300',
                    ].join(' ')}
                  >
                    {row.lead_captured ? 'Captured' : 'Not Captured'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-400">{formatDateTime(row.created_at)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}