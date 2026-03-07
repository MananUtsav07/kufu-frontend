import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { useTenantAuth } from './tenant-auth-context'

const TENANT_NAV_LINKS = [
  { to: '/property-management/tenant', label: 'Overview', icon: 'home' },
  { to: '/property-management/tenant/tickets', label: 'Tickets', icon: 'support' },
  { to: '/property-management/tenant/chat', label: 'AI Support Chat', icon: 'chat' },
  { to: '/property-management/tenant/support', label: 'Owner Support', icon: 'contact_support' },
]

function tenantLinkClass(isActive: boolean) {
  return [
    'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-200'
      : 'border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white',
  ].join(' ')
}

export function PropertyTenantLayout() {
  const navigate = useNavigate()
  const { tenant, property, logout } = useTenantAuth()

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-[1320px] grid-cols-1 lg:grid-cols-[250px_1fr]">
        <aside className="border-b border-white/10 bg-slate-950/70 p-4 lg:border-b-0 lg:border-r lg:p-5">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="font-display text-lg font-black text-white">Tenant Portal</p>
            <p className="mt-1 text-xs text-slate-400">{tenant?.full_name || 'Tenant User'}</p>
            <p className="mt-1 text-[11px] text-slate-500">{property?.property_name || 'Property'}</p>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {TENANT_NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) => tenantLinkClass(isActive)}
                end={link.to === '/property-management/tenant'}
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
              <p className="text-sm font-semibold text-white">{property?.property_name || 'Property Support'}</p>
              <p className="text-xs text-slate-400">{tenant?.tenant_access_id}</p>
            </div>
            <button
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20"
              type="button"
              onClick={() => {
                logout()
                navigate('/property-management/tenant/login', { replace: true })
              }}
            >
              Logout
            </button>
          </header>

          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
