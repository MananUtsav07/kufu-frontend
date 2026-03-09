import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { CreateAccountPage } from '../src/pages/CreateAccountPage'
import { renderWithRouter } from './utils/renderWithRouter'

const registerMock = vi.fn()

vi.mock('../src/lib/auth-context', () => ({
  useAuth: () => ({
    register: registerMock,
    loading: false,
    user: null,
    isAdmin: false,
    logout: vi.fn(),
    login: vi.fn(),
  }),
}))

describe('CreateAccountPage validation smoke', () => {
  it('shows validation message for mismatched password confirmation', async () => {
    const user = userEvent.setup()
    renderWithRouter(<CreateAccountPage />, ['/create-account'])

    await user.type(screen.getByLabelText(/^full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/^business name/i), 'Acme Co')
    await user.type(screen.getByLabelText(/^email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'StrongPass@123')
    await user.type(screen.getByLabelText(/confirm password/i), 'StrongPass@321')

    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    expect(registerMock).not.toHaveBeenCalled()
  })
})
