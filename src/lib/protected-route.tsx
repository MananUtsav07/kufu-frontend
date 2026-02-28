import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from './auth-context'

type ProtectedRouteProps = {
  children?: ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const location = useLocation()
  const { loading, isAuthenticated, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] text-slate-200">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate replace to="/dashboard" />
  }

  return children ? <>{children}</> : <Outlet />
}
