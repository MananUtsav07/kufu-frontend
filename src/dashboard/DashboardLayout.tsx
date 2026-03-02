import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '../lib/auth-context'
import './DashboardLayout.css'

const DASHBOARD_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/dashboard/chat-history', label: 'Chat History', icon: 'chat' },
  { to: '/dashboard/analytics', label: 'Analytics', icon: 'analytics' },
  { to: '/dashboard/chatbot-settings', label: 'Chatbot Settings', icon: 'tune' },
  { to: '/dashboard/test-chat', label: 'Test Chat', icon: 'psychology' },
  { to: '/dashboard/profile', label: 'Profile', icon: 'person' },
  { to: '/dashboard/plan', label: 'Your Plan', icon: 'workspace_premium' },
  { to: '/dashboard/upgrade', label: 'Upgrade Plan', icon: 'rocket_launch' },
  { to: '/dashboard/integrations', label: 'Integrations', icon: 'hub' },
  { to: '/dashboard/knowledge', label: 'Knowledge Base', icon: 'menu_book' },
  { to: '/dashboard/support', label: 'Support', icon: 'support_agent' },
  { to: '/dashboard/custom-quote', label: 'Custom Quote', icon: 'request_quote' },
] as const

function sidebarLinkClass({ isActive }: { isActive: boolean }) {
  return [
    'dashboard-sidebar-link inline-flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/40'
      : 'text-slate-300 hover:bg-white/[0.06] hover:text-white border border-transparent',
  ].join(' ')
}

export function DashboardLayout() {
  const navigate = useNavigate()
  const { user, client, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="dashboard-shell min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="dashboard-sidebar border-b border-white/10 p-4 lg:border-b-0 lg:border-r lg:p-5">
          <div className="dashboard-brand rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="font-display text-lg font-black text-white">Kufu Dashboard</p>
            <p className="mt-1 text-xs text-slate-400">{client?.businessName || 'Starter account'}</p>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {DASHBOARD_LINKS.map((link) => (
              <NavLink key={link.to} className={sidebarLinkClass} end={link.to === '/dashboard'} to={link.to}>
                <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
            {import.meta.env.DEV ? (
              <NavLink className={sidebarLinkClass} to="/dashboard/dev-test">
                <span className="material-symbols-outlined text-[18px]">science</span>
                <span>Dev Test</span>
              </NavLink>
            ) : null}
          </nav>
        </aside>

        <main className="dashboard-content min-w-0">
          <header className="dashboard-topbar sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/70 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div>
              <p className="text-sm font-semibold text-white">{client?.businessName || 'Kufu Client'}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-200">
                {user?.role || 'user'}
              </span>
              <button
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/5"
                type="button"
                onClick={() => navigate('/')}
              >
                View Site
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
