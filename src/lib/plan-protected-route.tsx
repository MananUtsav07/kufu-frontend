import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from './auth-context'

type PlanCode = 'free' | 'starter' | 'pro' | 'business'

type PlanProtectedRouteProps = {
  minPlan: Exclude<PlanCode, 'free'>
  children?: ReactNode
}

const PLAN_RANK: Record<PlanCode, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  business: 3,
}

function normalizePlanCode(input: unknown): PlanCode {
  const raw = typeof input === 'string' ? input.toLowerCase() : ''
  if (raw === 'starter' || raw === 'pro' || raw === 'business') {
    return raw
  }
  return 'free'
}

export function PlanProtectedRoute({ minPlan, children }: PlanProtectedRouteProps) {
  const location = useLocation()
  const { loading, isAdmin, plan } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-slate-200">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (isAdmin) {
    return children ? <>{children}</> : <Outlet />
  }

  const currentPlan = normalizePlanCode(plan?.code)
  if (PLAN_RANK[currentPlan] < PLAN_RANK[minPlan]) {
    return <Navigate replace state={{ from: location.pathname, minPlan }} to="/dashboard/upgrade" />
  }

  return children ? <>{children}</> : <Outlet />
}
