import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { WebsiteTypeDetector } from '../src/dashboard/components/WebsiteTypeDetector'
import { renderWithRouter } from './utils/renderWithRouter'

const postSiteDetectionDetectMock = vi.fn()
const getSiteDetectionInstallGuideMock = vi.fn()

vi.mock('../src/lib/api', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/api')>('../src/lib/api')
  return {
    ...actual,
    postSiteDetectionDetect: (...args: unknown[]) => postSiteDetectionDetectMock(...args),
    getSiteDetectionInstallGuide: (...args: unknown[]) => getSiteDetectionInstallGuideMock(...args),
  }
})

describe('WebsiteTypeDetector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window.navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    })
  })

  it('detects website type and renders install guide', async () => {
    const user = userEvent.setup()

    postSiteDetectionDetectMock.mockResolvedValueOnce({
      ok: true,
      websiteType: 'wordpress',
      confidence: 'high',
      signals: ['wp-content', '/wp-json'],
    })

    getSiteDetectionInstallGuideMock.mockResolvedValueOnce({
      ok: true,
      title: 'Install on WordPress',
      steps: ['Open dashboard', 'Paste script'],
      scriptExample: '<script src="https://example.com/widget/kufu.js?key=test" async></script>',
    })

    renderWithRouter(
      <WebsiteTypeDetector
        chatbotId="chatbot-1"
        chatbotName="Website Bot"
        websiteUrl="https://example.com"
      />,
    )

    await user.click(screen.getByRole('button', { name: /detect website/i }))

    await waitFor(() => {
      expect(screen.getByText(/detected:/i)).toBeInTheDocument()
    })

    expect(postSiteDetectionDetectMock).toHaveBeenCalledWith({
      chatbotId: 'chatbot-1',
      websiteUrl: 'https://example.com',
    })
    expect(getSiteDetectionInstallGuideMock).toHaveBeenCalledWith({
      websiteType: 'wordpress',
      chatbotId: 'chatbot-1',
    })
    expect(screen.getByText('Install on WordPress')).toBeInTheDocument()
  })
})
