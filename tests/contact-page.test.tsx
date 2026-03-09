import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ContactPage } from '../src/pages/home/ContactPage'
import { renderWithRouter } from './utils/renderWithRouter'

const postContactLeadMock = vi.fn(async () => ({ ok: true }))

vi.mock('../src/lib/api', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/api')>('../src/lib/api')
  return {
    ...actual,
    postContactLead: (...args: unknown[]) => postContactLeadMock(...args),
  }
})

vi.mock('../src/lib/auth-context', () => ({
  useAuth: () => ({
    loading: false,
    user: null,
    isAdmin: false,
    logout: vi.fn(),
    login: vi.fn(),
  }),
}))

describe('ContactPage smoke', () => {
  it('renders and submits contact form safely', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ContactPage />, ['/contact'])

    expect(screen.getByRole('heading', { name: /send us a message/i })).toBeInTheDocument()

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/email address/i), 'jane@acme.example')
    await user.selectOptions(screen.getByLabelText(/topic/i), 'Technical Support')
    await user.type(screen.getByLabelText(/^message$/i), 'Need help connecting WhatsApp')

    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(postContactLeadMock).toHaveBeenCalledTimes(1)
    })

    expect(postContactLeadMock).toHaveBeenCalledWith({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@acme.example',
      message: 'Topic: Technical Support\n\nNeed help connecting WhatsApp',
    })
  }, 10000)
})
