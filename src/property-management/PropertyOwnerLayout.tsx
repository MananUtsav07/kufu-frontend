import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '../lib/auth-context'

const OWNER_NAV_LINKS = [
  { to: '/property-management/owner', label: 'Overview', icon: 'dashboard' },
  { to: '/property-management/owner/tenants', label: 'Tenants', icon: 'groups' },
  { to: '/property-management/owner/tickets', label: 'Tickets', icon: 'support_agent' },
  { to: '/property-management/owner/notifications', label: 'Notifications', icon: 'notifications' },
]

function ownerLinkClass(isActive: boolean) {
  return [
    'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'border border-indigo-500/40 bg-indigo-500/20 text-indigo-200'
      : 'border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white',
  ].join(' ')
}

export function PropertyOwnerLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-white/10 bg-slate-950/70 p-4 lg:border-b-0 lg:border-r lg:p-5">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="font-display text-lg font-black text-white">Property Management</p>
            <p className="mt-1 text-xs text-slate-400">Owner Console</p>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {OWNER_NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) => ownerLinkClass(isActive)}
                end={link.to === '/property-management/owner'}
                to={link.to}
              >
                <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div>
              <p className="text-sm font-semibold text-white">Owner Dashboard</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/5"
                type="button"
                onClick={() => navigate('/dashboard')}
              >
                Back to SaaS Dashboard
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
