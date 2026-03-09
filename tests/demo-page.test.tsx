import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { DemoPage } from '../src/pages/DemoPage'
import { renderWithRouter } from './utils/renderWithRouter'

const postDemoLeadMock = vi.fn(async () => ({ ok: true }))

vi.mock('../src/lib/api', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/api')>('../src/lib/api')
  return {
    ...actual,
    postDemoLead: (...args: unknown[]) => postDemoLeadMock(...args),
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

describe('DemoPage smoke', () => {
  it('renders form and submits lead payload safely', async () => {
    const user = userEvent.setup()
    renderWithRouter(<DemoPage />, ['/demo'])

    expect(screen.getByRole('heading', { name: /request a free demo/i })).toBeInTheDocument()

    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/business name/i), 'Acme Fitness')
    await user.type(screen.getByLabelText(/website url/i), 'https://acme.example')
    await user.type(screen.getByLabelText(/email address/i), 'jane@acme.example')
    await user.type(screen.getByLabelText(/phone number/i), '+91 9999999999')
    await user.type(
      screen.getByLabelText(/what do you want from your chatbot/i),
      'Answer FAQs and capture leads',
    )

    await user.click(screen.getByRole('button', { name: /request my free demo/i }))

    await waitFor(() => {
      expect(postDemoLeadMock).toHaveBeenCalledTimes(1)
    })

    expect(postDemoLeadMock).toHaveBeenCalledWith({
      fullName: 'Jane Doe',
      businessType: 'Acme Fitness',
      websiteUrl: 'https://acme.example',
      phone: '+91 9999999999',
      email: 'jane@acme.example',
      message: 'Answer FAQs and capture leads',
    })
  }, 10000)
})
