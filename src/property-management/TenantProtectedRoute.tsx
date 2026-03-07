import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useTenantAuth } from './tenant-auth-context'

type TenantProtectedRouteProps = {
  children?: ReactNode
}

export function TenantProtectedRoute({ children }: TenantProtectedRouteProps) {
  const location = useLocation()
  const { loading, isAuthenticated } = useTenantAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-slate-200">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location.pathname }} to="/property-management/tenant/login" />
  }

  return children ? <>{children}</> : <Outlet />
}
