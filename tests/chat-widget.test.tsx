import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ChatWidget } from '../src/components/ChatWidget'
import { renderWithRouter } from './utils/renderWithRouter'

const sendMessageMock = vi.fn()

vi.mock('../src/lib/chat-context', () => ({
  useChat: () => ({
    clearChat: vi.fn(),
    error: null,
    isTyping: false,
    messages: [
      {
        id: 'msg-1',
        role: 'assistant',
        content: 'How can I help?',
      },
    ],
    quickReplies: [],
    retryLastResponse: vi.fn(),
    sendMessage: sendMessageMock,
  }),
}))

describe('ChatWidget smoke', () => {
  it('renders and sends a message through the chat handler', async () => {
    const user = userEvent.setup()
    renderWithRouter(<ChatWidget mode="embedded" />)

    const input = screen.getByPlaceholderText(/type a message/i)
    await user.type(input, 'Need pricing help')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(sendMessageMock).toHaveBeenCalledTimes(1)
    expect(sendMessageMock).toHaveBeenCalledWith('Need pricing help')
  })
})
