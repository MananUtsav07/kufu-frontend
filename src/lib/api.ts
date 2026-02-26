import type { Message } from './types'

type ApiOkResponse = {
  ok: true
}

type ApiErrorPayload = {
  ok?: false
  error?: string
  message?: string
  reply?: string
  details?: unknown
  status?: number | null
  issues?: unknown
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  headers?: HeadersInit
  auth?: boolean
}

export type AuthUser = {
  id: string
  email: string
  is_verified: boolean
}

export type AuthClient = {
  id: string
  business_name: string
  website_url: string | null
  plan: string
}

export type AuthMeResponse = {
  ok: true
  user: AuthUser
  client: AuthClient
}

export type RegisterPayload = {
  email: string
  password: string
  business_name?: string
  website_url?: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  ok: true
  token: string
  user: AuthUser
  client: AuthClient
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
    client_id?: string
  }
  sessionId?: string
  client_id?: string
  lead?: {
    name?: string
    email?: string
    phone?: string
    need?: string
    client_id?: string
  }
}

export type DashboardMetrics = {
  total_leads: number
  leads_last_7_days: number
  number_of_chats: number
}

export type DashboardLead = {
  id: string
  client_id: string
  name: string | null
  email: string | null
  phone: string | null
  need: string | null
  status: string
  source: string | null
  created_at: string
}

export type DashboardKnowledge = {
  id?: string
  client_id: string
  services_text: string | null
  pricing_text: string | null
  faqs_json: unknown[]
  hours_text: string | null
  contact_text: string | null
  updated_at?: string
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

let authToken: string | null = null

export function setApiAuthToken(token: string | null) {
  authToken = token?.trim() ? token.trim() : null
}

export function getApiBaseUrl(): string {
  const envValue = import.meta.env.VITE_API_BASE_URL
  if (typeof envValue === 'string' && envValue.trim().length > 0) {
    return envValue.trim().replace(/\/+$/, '')
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase()
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:8787'
    }
  }

  return 'https://kufu-backend.vercel.app'
}

function resolveApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path
  }
  const normalPath = path.startsWith('/') ? path : `/${path}`
  return `${getApiBaseUrl()}${normalPath}`
}

async function parseErrorPayload(response: Response): Promise<ApiErrorPayload | null> {
  try {
    return (await response.json()) as ApiErrorPayload
  } catch {
    return null
  }
}

async function requestJson<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const headers = new Headers(options.headers ?? {})
  headers.set('Accept', 'application/json')
  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }
  if (options.auth !== false && authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  let response: Response
  try {
    response = await fetch(resolveApiUrl(path), {
      method: options.method ?? (options.body !== undefined ? 'POST' : 'GET'),
      headers,
      credentials: 'include',
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })
  } catch (error) {
    throw new ApiError(error instanceof Error ? error.message : 'Network error', 0, error)
  }

  if (!response.ok) {
    const errorPayload = await parseErrorPayload(response)
    throw new ApiError(
      errorPayload?.error ??
        errorPayload?.message ??
        errorPayload?.reply ??
        `Request failed with status ${response.status}`,
      response.status,
      errorPayload,
    )
  }

  if (response.status === 204) {
    return {} as TResponse
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
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
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
        errorPayload?.message ??
        errorPayload?.reply ??
        `Request failed with status ${response.status}`,
      response.status,
      errorPayload,
    )
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const json = (await response.json()) as { reply?: unknown }
    if (typeof json.reply === 'string' && json.reply.length > 0) {
      handlers.onToken(json.reply)
      return
    }
    throw new ApiError('Invalid chat response shape', response.status, json)
  }

  if (!response.body) {
    throw new ApiError('Response stream is unavailable', 0)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

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
        return
      }

      const rawData = event.data ?? ''
      if (!rawData || rawData === '[DONE]') {
        continue
      }

      try {
        const parsed = JSON.parse(rawData) as { token?: unknown }
        if (typeof parsed.token === 'string') {
          handlers.onToken(parsed.token)
        }
      } catch {
        handlers.onToken(rawData)
      }
    }
  }
}

export function postDemoLead(payload: DemoLeadPayload): Promise<ApiOkResponse> {
  return requestJson<ApiOkResponse>('/api/leads/demo', { body: payload })
}

export function postContactLead(payload: ContactLeadPayload): Promise<ApiOkResponse> {
  return requestJson<ApiOkResponse>('/api/leads/contact', { body: payload })
}

export function postChatLog(payload: ChatLogPayload): Promise<ApiOkResponse> {
  return requestJson<ApiOkResponse>('/api/chat/log', { body: payload })
}

export function getHealth(): Promise<{ ok: boolean; env: string; openaiKeyPresent: boolean }> {
  return requestJson('/api/health', { auth: false })
}

export function postRegister(payload: RegisterPayload): Promise<ApiOkResponse> {
  return requestJson<ApiOkResponse>('/api/auth/register', { body: payload, auth: false })
}

export function postVerifyEmail(payload: { token: string }): Promise<ApiOkResponse> {
  return requestJson<ApiOkResponse>('/api/auth/verify-email', { body: payload, auth: false })
}

export function postLogin(payload: LoginPayload): Promise<LoginResponse> {
  return requestJson<LoginResponse>('/api/auth/login', { body: payload, auth: false })
}

export function postLogout(): Promise<ApiOkResponse> {
  return requestJson<ApiOkResponse>('/api/auth/logout', { body: {} })
}

export function getMe(): Promise<AuthMeResponse> {
  return requestJson<AuthMeResponse>('/api/auth/me')
}

export function getDashboardMetrics(): Promise<{ ok: true; metrics: DashboardMetrics }> {
  return requestJson('/api/dashboard/metrics')
}

export function getDashboardLeads(params?: {
  limit?: number
  offset?: number
  status?: string
}): Promise<{ ok: true; leads: DashboardLead[]; pagination: { limit: number; offset: number; total: number } }> {
  const query = new URLSearchParams()
  if (params?.limit !== undefined) query.set('limit', String(params.limit))
  if (params?.offset !== undefined) query.set('offset', String(params.offset))
  if (params?.status) query.set('status', params.status)
  const suffix = query.toString() ? `?${query.toString()}` : ''
  return requestJson(`/api/dashboard/leads${suffix}`)
}

export function patchDashboardLeadStatus(
  leadId: string,
  status: string,
): Promise<{ ok: true; lead: DashboardLead }> {
  return requestJson(`/api/dashboard/leads/${encodeURIComponent(leadId)}`, {
    method: 'PATCH',
    body: { status },
  })
}

export function getDashboardKnowledge(): Promise<{ ok: true; knowledge: DashboardKnowledge }> {
  return requestJson('/api/dashboard/knowledge')
}

export function postDashboardKnowledge(payload: {
  services_text?: string | null
  pricing_text?: string | null
  faqs_json?: unknown[]
  hours_text?: string | null
  contact_text?: string | null
}): Promise<{ ok: true; knowledge: DashboardKnowledge }> {
  return requestJson('/api/dashboard/knowledge', {
    body: payload,
  })
}

export function verifyAccount(params: { token: string }): Promise<ApiOkResponse> {
  return postVerifyEmail({ token: params.token })
}
