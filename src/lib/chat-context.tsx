/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { ApiError, streamChat, type ChatPayload } from './api'
import { DEFAULT_ASSISTANT_MESSAGE } from './chat'
import { STORAGE_KEYS, getOrCreateStorageSession, readStorageList, writeStorageList } from './storage'
import type { Message } from './types'

type ChatContextValue = {
  messages: Message[]
  isTyping: boolean
  error: string | null
  quickReplies: Array<{ label: string; message: string }>
  sendMessage: (content: string) => void
  retryLastResponse: () => void
  clearChat: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

const QUICK_REPLIES: Array<{ label: string; message: string }> = [
  { label: 'Integration Guide', message: 'Can you share the integration guide?' },
  { label: 'View Pricing', message: 'What are your pricing tiers?' },
  { label: 'Talk to Human', message: 'I want to talk to human' },
]

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

const createMessage = (role: Message['role'], content: string): Message => ({
  id: createId(),
  role,
  content,
  createdAt: Date.now(),
})

const getInitialMessages = (): Message[] => {
  const stored = readStorageList<Message>(STORAGE_KEYS.chat)
  if (stored.length > 0) {
    if (stored.length === 1 && stored[0]?.role === 'assistant') {
      return [{ ...stored[0], content: DEFAULT_ASSISTANT_MESSAGE }]
    }

    return stored
  }

  return [createMessage('assistant', DEFAULT_ASSISTANT_MESSAGE)]
}

function mapMessagesForApi(messages: Message[]): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages
    .filter((message) => message.content.trim().length > 0)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }))
}

const getCurrentPage = () => (typeof window !== 'undefined' ? window.location.pathname : undefined)

function getDevErrorDetails(error: ApiError): string | null {
  if (!import.meta.env.DEV || !error.details || typeof error.details !== 'object') {
    return null
  }

  const detailsPayload = error.details as { details?: unknown }
  if (typeof detailsPayload.details === 'string' && detailsPayload.details.trim().length > 0) {
    return detailsPayload.details
  }

  return null
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessionId] = useState(() => getOrCreateStorageSession(STORAGE_KEYS.chatSession))
  const [messages, setMessages] = useState<Message[]>(() => getInitialMessages())
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const failedPayloadRef = useRef<ChatPayload | null>(null)

  useEffect(() => {
    writeStorageList(STORAGE_KEYS.chat, messages)
  }, [messages])

  const streamAssistantResponse = useCallback(async (payload: ChatPayload) => {
    const assistantMessage = createMessage('assistant', '')
    setMessages((prev) => [...prev, assistantMessage])
    setError(null)
    setIsTyping(true)

    try {
      await streamChat(payload, {
        onToken: (token) => {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantMessage.id
                ? { ...message, content: `${message.content}${token}` }
                : message,
            ),
          )
        },
      })

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessage.id && message.content.trim().length === 0
            ? {
                ...message,
                content:
                  'Thanks for your message. Could you share your goal so I can guide you better?',
              }
            : message,
        ),
      )
      failedPayloadRef.current = null
    } catch (streamError) {
      const devDetails =
        streamError instanceof ApiError ? getDevErrorDetails(streamError) : null

      const nextErrorMessage =
        devDetails
          ? devDetails
          : streamError instanceof ApiError && streamError.status === 429
          ? 'Rate limit reached. Please wait a few minutes and try again.'
          : streamError instanceof Error
            ? streamError.message
            : 'Could not get AI response. Please retry.'

      setError(nextErrorMessage)
      failedPayloadRef.current = payload

      setMessages((prev) => prev.filter((message) => message.id !== assistantMessage.id))
    } finally {
      setIsTyping(false)
    }
  }, [])

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim()
      if (!trimmed || isTyping) {
        return
      }

      const userMessage = createMessage('user', trimmed)
      const nextMessages = [...messages, userMessage]
      setMessages(nextMessages)

      const payload: ChatPayload = {
        sessionId,
        metadata: { page: getCurrentPage() },
        messages: mapMessagesForApi(nextMessages),
      }

      void streamAssistantResponse(payload)
    },
    [isTyping, messages, sessionId, streamAssistantResponse],
  )

  const retryLastResponse = useCallback(() => {
    if (isTyping || !failedPayloadRef.current) {
      return
    }

    void streamAssistantResponse(failedPayloadRef.current)
  }, [isTyping, streamAssistantResponse])

  const clearChat = useCallback(() => {
    setMessages([createMessage('assistant', DEFAULT_ASSISTANT_MESSAGE)])
    setError(null)
    setIsTyping(false)
    failedPayloadRef.current = null
  }, [])

  const value = useMemo<ChatContextValue>(
    () => ({
      messages,
      isTyping,
      error,
      quickReplies: QUICK_REPLIES,
      sendMessage,
      retryLastResponse,
      clearChat,
    }),
    [clearChat, error, isTyping, messages, retryLastResponse, sendMessage],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used inside ChatProvider')
  }

  return context
}
