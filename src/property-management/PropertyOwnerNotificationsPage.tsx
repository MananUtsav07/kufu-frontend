import { useEffect, useState } from 'react'

import {
  ApiError,
  getPropertyOwnerNotifications,
  type PropertyOwnerNotification,
} from '../lib/api'
import { PropertyEmptyState } from './components/PropertyEmptyState'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function PropertyOwnerNotificationsPage() {
  const [notifications, setNotifications] = useState<PropertyOwnerNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getPropertyOwnerNotifications()
        if (mounted) {
          setNotifications(response.notifications)
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError instanceof ApiError ? requestError.message : 'Failed to load notifications.')
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
  }, [])

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Owner Notifications</h1>
        <p className="text-sm text-slate-400">Escalations, tickets, and reminder events.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-400">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <PropertyEmptyState title="No notifications yet" description="Notifications will appear when tenants raise activity." />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <article key={notification.id} className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{notification.title}</p>
                <div className="inline-flex items-center gap-2">
                  {!notification.is_read ? <span className="h-2 w-2 rounded-full bg-emerald-400" /> : null}
                  <span className="text-xs text-slate-500">{formatDate(notification.created_at)}</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-slate-300">{notification.message}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-500">{notification.notification_type}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
