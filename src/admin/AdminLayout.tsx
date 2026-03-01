import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '../lib/auth-context'
import './AdminLayout.css'

const ADMIN_LINKS = [
  { to: '/admin', label: 'Overview', icon: 'monitoring' },
  { to: '/admin/users', label: 'Users', icon: 'group' },
  { to: '/admin/messages', label: 'Messages', icon: 'forum' },
  { to: '/admin/tickets', label: 'Tickets', icon: 'support_agent' },
  { to: '/admin/quotes', label: 'Quotes / Upgrades', icon: 'request_quote' },
] as const

function linkClass({ isActive }: { isActive: boolean }) {
  return [
    'inline-flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/40'
      : 'text-slate-300 hover:bg-white/[0.06] hover:text-white border border-transparent',
  ].join(' ')
}

export function AdminLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="admin-shell min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="admin-sidebar border-b border-white/10 p-4 lg:border-b-0 lg:border-r lg:p-5">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="font-display text-lg font-black text-white">Kufu Admin</p>
            <p className="mt-1 text-xs text-slate-400">{user?.email}</p>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {ADMIN_LINKS.map((link) => (
              <NavLink key={link.to} className={linkClass} end={link.to === '/admin'} to={link.to}>
                <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl sm:px-6">
            <h1 className="text-sm font-semibold text-white">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <button
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/5"
                type="button"
                onClick={() => navigate('/dashboard')}
              >
                Client Dashboard
              </button>
              <button
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </header>
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
