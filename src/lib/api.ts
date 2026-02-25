import type { Message } from './types'

type ApiOkResponse = {
  ok: true
}

type ChatLogMessage = Pick<Message, 'role' | 'content' | 'createdAt'>

export type DemoLeadPayload = {
  fullName: string
  businessType: string
  phone: string
  email: string
  message?: string
}

export type ContactLeadPayload = {
  firstName: string
  lastName: string
  email: string
  message?: string
}

export type ChatLogPayload = {
  sessionId: string
  messages: ChatLogMessage[]
  page?: string
}

export type ChatMessagePayload = {
  role: 'user' | 'assistant'
  content: string
}

export type ChatPayload = {
  messages: ChatMessagePayload[]
  metadata?: {
    page?: string
  }
  sessionId?: string
}

type ApiErrorPayload = {
  ok?: false
  error?: string
  reply?: string
  details?: unknown
  status?: number | null
  issues?: unknown
}

export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

const getApiBaseUrl = (): string => {
  const envValue = import.meta.env.VITE_API_BASE_URL
  return typeof envValue === 'string' ? envValue.trim().replace(/\/$/, '') : ''
}

const resolveApiUrl = (path: string): string => `${getApiBaseUrl()}${path}`

async function parseErrorPayload(response: Response): Promise<ApiErrorPayload | null> {
  try {
    return (await response.json()) as ApiErrorPayload
  } catch {
    return null
  }
}

async function postJson<TPayload, TResponse>(path: string, payload: TPayload): Promise<TResponse> {
  let response: Response

  try {
    response = await fetch(resolveApiUrl(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0,
      error,
    )
  }

  if (!response.ok) {
    const errorPayload = await parseErrorPayload(response)
    throw new ApiError(
      errorPayload?.error ??
        errorPayload?.reply ??
        `Request failed with status ${response.status}`,
      response.status,
      errorPayload,
    )
  }

  return (await response.json()) as TResponse
}

function parseSseEvents(rawChunk: string): { events: Array<{ event?: string; data?: string }>; rest: string } {
  const normalized = rawChunk.replace(/\r\n/g, '\n')
  const blocks = normalized.split('\n\n')
  const rest = blocks.pop() ?? ''

  const events: Array<{ event?: string; data?: string }> = []
  for (const block of blocks) {
    const lines = block.split('\n')
    let eventName: string | undefined
    const dataParts: string[] = []

    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventName = line.slice('event:'.length).trim()
      } else if (line.startsWith('data:')) {
        dataParts.push(line.slice('data:'.length).trimStart())
      }
    }

    if (!eventName && dataParts.length === 0) {
      continue
    }

    events.push({
      event: eventName,
      data: dataParts.join('\n'),
    })
  }

  return { events, rest }
}

export async function streamChat(
  payload: ChatPayload,
  handlers: {
    onToken: (token: string) => void
  },
): Promise<void> {
  let response: Response

  try {
    response = await fetch(resolveApiUrl('/api/chat'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    throw new ApiError(error instanceof Error ? error.message : 'Network error', 0, error)
  }

  if (!response.ok) {
    const errorPayload = await parseErrorPayload(response)
    throw new ApiError(
      errorPayload?.error ??
        errorPayload?.reply ??
        `Request failed with status ${response.status}`,
      response.status,
      errorPayload,
    )
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const payload = (await response.json()) as { reply?: unknown; meta?: unknown }
    if (typeof payload.reply === 'string' && payload.reply.length > 0) {
      handlers.onToken(payload.reply)
      return
    }

    throw new ApiError('Invalid chat response shape', response.status, payload)
  }

  if (!response.body) {
    throw new ApiError('Response stream is unavailable', 0)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let doneReceived = false

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }

    buffer += decoder.decode(value, { stream: true })
    const { events, rest } = parseSseEvents(buffer)
    buffer = rest

    for (const event of events) {
      if (event.event === 'done') {
        doneReceived = true
        continue
      }

      const rawData = event.data ?? ''
      if (!rawData || rawData === '[DONE]') {
        doneReceived = true
        continue
      }

      try {
        const parsed = JSON.parse(rawData) as { token?: unknown; error?: unknown }
        if (typeof parsed.token === 'string') {
          handlers.onToken(parsed.token)
        }
      } catch {
        handlers.onToken(rawData)
      }
    }
  }

  if (!doneReceived && buffer.trim().length > 0) {
    const { events } = parseSseEvents(`${buffer}\n\n`)
    for (const event of events) {
      if (event.event === 'done' || event.data === '[DONE]') {
        doneReceived = true
      }
    }
  }
}

export function postDemoLead(payload: DemoLeadPayload): Promise<ApiOkResponse> {
  return postJson<DemoLeadPayload, ApiOkResponse>('/api/leads/demo', payload)
}

export function postContactLead(payload: ContactLeadPayload): Promise<ApiOkResponse> {
  return postJson<ContactLeadPayload, ApiOkResponse>('/api/leads/contact', payload)
}

export function postChatLog(payload: ChatLogPayload): Promise<ApiOkResponse> {
  return postJson<ChatLogPayload, ApiOkResponse>('/api/chat/log', payload)
}
