import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { ProtectedRoute } from '../src/lib/protected-route'

const authState = {
  loading: false,
  isAuthenticated: false,
  isAdmin: false,
}

vi.mock('../src/lib/auth-context', () => ({
  useAuth: () => authState,
}))

describe('ProtectedRoute smoke', () => {
  it('redirects unauthenticated users to login', () => {
    authState.loading = false
    authState.isAuthenticated = false
    authState.isAdmin = false

    renderRoute('/dashboard')
    expect(screen.getByText('Login Route')).toBeInTheDocument()
  })

  it('renders protected content for authenticated users', () => {
    authState.loading = false
    authState.isAuthenticated = true
    authState.isAdmin = false

    renderRoute('/dashboard')
    expect(screen.getByText('Dashboard Route')).toBeInTheDocument()
  })

  it('blocks admin routes for non-admin users', () => {
    authState.loading = false
    authState.isAuthenticated = true
    authState.isAdmin = false

    renderAdminRoute('/admin')
    expect(screen.getByText('Dashboard Route')).toBeInTheDocument()
  })
})

function renderRoute(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard Route</div>} />
        </Route>
        <Route path="/login" element={<div>Login Route</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

function renderAdminRoute(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<div>Admin Route</div>} />
        </Route>
        <Route path="/dashboard" element={<div>Dashboard Route</div>} />
      </Routes>
    </MemoryRouter>,
  )
}
