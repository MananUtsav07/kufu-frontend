import { useMemo } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { GLOBAL_CHAT_OPEN_EVENT } from '../components/GlobalFloatingChat'
import { useAuth } from '../lib/auth-context'
import { useChat } from '../lib/chat-context'
import './DashboardLayout.css'

type GatePlanCode = 'starter' | 'pro'
type CurrentPlanCode = 'free' | 'starter' | 'pro' | 'business' | 'admin'

type DashboardLink = {
  to: string
  label: string
  icon: string
  requiredPlan?: GatePlanCode
  lockHint?: string
}

type DashboardSection = {
  title: string
  links: DashboardLink[]
}

const DASHBOARD_SECTIONS: DashboardSection[] = [
  {
    title: 'Setup',
    links: [
      { to: '/dashboard', label: 'Setup Home', icon: 'dashboard' },
      { to: '/dashboard/integrations', label: 'Integrations & Widget', icon: 'hub' },
      { to: '/dashboard/knowledge', label: 'Knowledge Base', icon: 'menu_book' },
      { to: '/dashboard/chatbot-settings', label: 'Bot Behavior', icon: 'tune' },
      { to: '/dashboard/test-chat', label: 'Test Assistant', icon: 'psychology' },
    ],
  },
  {
    title: 'Monitor',
    links: [
      {
        to: '/dashboard/chat-history',
        label: 'Conversations',
        icon: 'chat',
        requiredPlan: 'starter',
        lockHint: 'Upgrade to Starter to unlock Chat History',
      },
      {
        to: '/dashboard/analytics',
        label: 'Insights',
        icon: 'analytics',
        requiredPlan: 'pro',
        lockHint: 'Upgrade to Pro to unlock Analytics',
      },
      { to: '/dashboard/leads', label: 'Leads', icon: 'groups' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/dashboard/plan', label: 'Billing & Plan', icon: 'workspace_premium' },
      { to: '/dashboard/upgrade', label: 'Upgrade', icon: 'rocket_launch' },
      { to: '/dashboard/profile', label: 'Profile', icon: 'person' },
      { to: '/dashboard/support', label: 'Help & Support', icon: 'support_agent' },
      { to: '/dashboard/custom-quote', label: 'Custom Quote', icon: 'request_quote' },
    ],
  },
]

function normalizeCurrentPlan(planCode: string | undefined, isAdmin: boolean): CurrentPlanCode {
  if (isAdmin) {
    return 'admin'
  }

  if (planCode === 'starter' || planCode === 'pro' || planCode === 'business') {
    return planCode
  }

  return 'free'
}

function hasPlanAccess(currentPlan: CurrentPlanCode, requiredPlan?: GatePlanCode): boolean {
  if (!requiredPlan || currentPlan === 'admin') {
    return true
  }

  if (requiredPlan === 'starter') {
    return currentPlan === 'starter' || currentPlan === 'pro' || currentPlan === 'business'
  }

  return currentPlan === 'pro' || currentPlan === 'business'
}

function sidebarLinkClass({ isActive, isLocked }: { isActive: boolean; isLocked: boolean }) {
  return [
    'dashboard-sidebar-link inline-flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/40'
      : 'text-slate-300 hover:bg-white/[0.06] hover:text-white border border-transparent',
    isLocked ? 'dashboard-sidebar-link-locked' : '',
  ].join(' ')
}

export function DashboardLayout() {
  const navigate = useNavigate()
  const { primeAssistantMessage } = useChat()
  const { user, client, logout, plan, subscription, isAdmin } = useAuth()
  const currentPlan = normalizeCurrentPlan(
    typeof plan?.code === 'string' ? plan.code.toLowerCase() : undefined,
    isAdmin,
  )
  const usageLabel = useMemo(() => {
    if (isAdmin) {
      return 'Unlimited'
    }

    const planCode = typeof plan?.code === 'string' ? plan.code.toLowerCase() : 'free'
    if (!subscription) {
      return '-'
    }

    if (planCode === 'free') {
      return `${subscription.total_message_count}/10 lifetime`
    }

    if (plan?.monthly_message_cap == null) {
      return `${subscription.message_count_in_period} this period`
    }

    return `${subscription.message_count_in_period}/${plan.monthly_message_cap} this period`
  }, [isAdmin, plan, subscription])

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  const handleHelpPrompt = () => {
    primeAssistantMessage('Hi, what can I help you with?')
    window.dispatchEvent(new Event(GLOBAL_CHAT_OPEN_EVENT))
  }

  return (
    <div className="dashboard-shell min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="dashboard-sidebar border-b border-white/10 p-4 lg:border-b-0 lg:border-r lg:p-5">
          <div className="dashboard-brand rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="font-display text-lg font-black text-white">Client Dashboard</p>
            <p className="mt-1 text-xs text-slate-400">{client?.businessName || 'Starter account'}</p>
            <div className="mt-3 rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-3 py-2">
              <p className="text-[11px] uppercase tracking-wide text-indigo-200">Message Usage</p>
              <p className="mt-1 text-sm font-semibold text-indigo-100">{usageLabel}</p>
            </div>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-4 lg:overflow-visible lg:pb-0">
            {DASHBOARD_SECTIONS.map((section) => (
              <div key={section.title} className="min-w-[220px] rounded-xl border border-white/5 bg-slate-950/35 p-2 lg:min-w-0">
                <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{section.title}</p>
                <div className="flex gap-2 lg:flex-col">
                  {section.links.map((link) => {
                    const isLocked = !hasPlanAccess(currentPlan, link.requiredPlan)

                    if (isLocked) {
                      return (
                        <button
                          key={link.to}
                          className={`${sidebarLinkClass({ isActive: false, isLocked })} w-full justify-start text-left`}
                          title={link.lockHint ?? 'Upgrade required'}
                          type="button"
                          onClick={() => navigate('/dashboard/upgrade')}
                        >
                          <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                          <span>{link.label}</span>
                          <span className="dashboard-link-lock" aria-label={link.lockHint ?? 'Upgrade required'}>
                            <span className="material-symbols-outlined text-[15px]">lock</span>
                            <span className="dashboard-link-tooltip">{link.lockHint ?? 'Upgrade required'}</span>
                          </span>
                        </button>
                      )
                    }

                    return (
                      <NavLink
                        key={link.to}
                        className={({ isActive }) => sidebarLinkClass({ isActive, isLocked })}
                        end={link.to === '/dashboard'}
                        to={link.to}
                      >
                        <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
                        <span>{link.label}</span>
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            ))}
            {import.meta.env.DEV ? (
              <NavLink className={({ isActive }) => sidebarLinkClass({ isActive, isLocked: false })} to="/dashboard/dev-test">
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
              <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-200">
                {usageLabel}
              </span>
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-200">
                {user?.role || 'user'}
              </span>
              <button
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/20"
                type="button"
                onClick={handleHelpPrompt}
              >
                Need Help?
              </button>
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
