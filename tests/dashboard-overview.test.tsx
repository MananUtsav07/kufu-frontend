import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DashboardOverviewPage } from '../src/dashboard/DashboardOverviewPage'
import { ApiError } from '../src/lib/api'
import { renderWithRouter } from './utils/renderWithRouter'

const getDashboardSummaryMock = vi.fn()
const getDashboardChatbotsMock = vi.fn()

const authState = {
  plan: { code: 'starter', monthly_message_cap: 1000, chatbot_limit: 1 },
  isAdmin: false,
  user: { id: 'user-1', email: 'starter@example.com', isVerified: true, role: 'user' as const },
}

vi.mock('../src/lib/auth-context', () => ({
  useAuth: () => authState,
}))

vi.mock('../src/lib/api', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/api')>('../src/lib/api')
  return {
    ...actual,
    getDashboardSummary: (...args: unknown[]) => getDashboardSummaryMock(...args),
    getDashboardChatbots: (...args: unknown[]) => getDashboardChatbotsMock(...args),
  }
})

describe('DashboardOverviewPage smoke', () => {
  it('loads and renders summary widgets for authenticated user', async () => {
    getDashboardSummaryMock.mockResolvedValueOnce({
      ok: true,
      summary: {
        messages_used_this_period: 12,
        total_messages_lifetime: 80,
        plan: 'starter',
        integrations_used: 1,
        integration_limit: 1,
        tickets_open: 2,
      },
      recent_sessions: [
        {
          session_id: 'session-1',
          messages: [
            {
              content: 'Hello from visitor',
              created_at: '2026-03-01T00:00:00.000Z',
            },
          ],
        },
      ],
      plan: { code: 'starter', monthly_message_cap: 1000, chatbot_limit: 1 },
      subscription: {
        id: 'sub-1',
        user_id: 'user-1',
        plan_code: 'starter',
        status: 'active',
        current_period_start: '2026-03-01T00:00:00.000Z',
        current_period_end: '2026-04-01T00:00:00.000Z',
        message_count_in_period: 12,
        total_message_count: 80,
      },
    })

    getDashboardChatbotsMock.mockResolvedValueOnce({
      ok: true,
      chatbots: [
        {
          id: 'chatbot-1',
          name: 'Website Bot',
          website_url: 'https://example.com',
        },
      ],
    })

    renderWithRouter(<DashboardOverviewPage />, ['/dashboard'])

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('1/1')).toBeInTheDocument()
    expect(screen.getByText('Recent Chat Sessions')).toBeInTheDocument()
  })

  it('renders a safe error state when summary request fails', async () => {
    getDashboardSummaryMock.mockRejectedValueOnce(new ApiError('Failed to load dashboard summary.', 500))
    getDashboardChatbotsMock.mockResolvedValueOnce({ ok: true, chatbots: [] })

    renderWithRouter(<DashboardOverviewPage />, ['/dashboard'])

    await waitFor(() => {
      expect(screen.getByText('Failed to load dashboard summary.')).toBeInTheDocument()
    })
  })
})
