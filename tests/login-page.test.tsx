import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { LoginPage } from '../src/pages/LoginPage'
import { renderWithRouter } from './utils/renderWithRouter'

const loginMock = vi.fn(async () => undefined)
const logoutMock = vi.fn(async () => undefined)

const authState = {
  loading: false,
  user: null,
  isAdmin: false,
  login: loginMock,
  logout: logoutMock,
}

vi.mock('../src/lib/auth-context', () => ({
  useAuth: () => authState,
}))

describe('LoginPage smoke', () => {
  it('renders and submits login form', async () => {
    const user = userEvent.setup()
    renderWithRouter(<LoginPage />, ['/login'])

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()

    await user.type(screen.getByLabelText(/email address/i), '  owner@example.com ')
    await user.type(screen.getByLabelText(/^password$/i), 'Secret@123')
    await user.click(screen.getByRole('button', { name: /^sign in$/i }))

    expect(loginMock).toHaveBeenCalledTimes(1)
    expect(loginMock).toHaveBeenCalledWith('owner@example.com', 'Secret@123')
  })
})
