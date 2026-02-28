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

export type Plan = {
  id?: string
  code: 'free' | 'starter' | 'pro' | 'business' | string
  name?: string
  monthly_message_cap: number | null
  chatbot_limit: number | null
  price_inr?: number
  is_active?: boolean
}

export type Subscription = {
  id: string
  user_id: string
  plan_code: string
  status: string
  current_period_start: string
  current_period_end: string
  message_count_in_period: number
  total_message_count: number
  created_at?: string
  updated_at?: string
}

export type AuthUser = {
  id: string
  email: string
  is_verified: boolean
  role: 'user' | 'admin'
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
  subscription: Subscription
  plan: Plan
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

export type LoginResponse = AuthMeResponse & {
  token: string
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
  sessionId?: string
  key?: string
  chatbot_id?: string
  client_id?: string
  metadata?: {
    page?: string
    key?: string
    chatbot_id?: string
    client_id?: string
  }
}

export type DashboardSummary = {
  messages_used_this_period: number
  total_messages_lifetime: number
  plan: string
  integrations_used: number
  integration_limit: number
  tickets_open: number
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
  knowledge_base_text: string
  updated_at?: string
}

export type DashboardTicket = {
  id: string
  user_id: string
  subject: string
  message: string
  admin_response: string | null
  status: 'open' | 'closed'
  created_at: string
  updated_at: string
}

export type DashboardQuote = {
  id: string
  user_id: string
  requested_plan: string | null
  requested_chatbots: number | null
  requested_unlimited_messages: boolean
  notes: string | null
  status: string
  admin_response: string | null
  created_at: string
  updated_at: string
}

export type DashboardChatbot = {
  id: string
  user_id: string
  client_id: string | null
  name: string
  website_url: string | null
  allowed_domains: string[]
  widget_public_key: string
  is_active: boolean
  created_at: string
}

export type RagIngestionRunStatus = 'running' | 'done' | 'failed' | 'canceled'

export type RagIngestionRun = {
  runId: string
  chatbotId: string
  status: RagIngestionRunStatus
  pagesFound: number
  pagesCrawled: number
  chunksWritten: number
  error: string | null
  cancelRequested: boolean
  startedAt: string
  finishedAt: string | null
  updatedAt: string
}

export type AdminOverview = {
  total_users: number
  total_clients: number
  active_subscriptions_by_plan: Record<string, number>
  total_messages_last_24h: number
  total_messages_last_7d: number
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

  if (import.meta.env.DEV) {
    return 'http://localhost:8787'
  }

  throw new Error('Missing VITE_API_BASE_URL in production build. Point it to your Render backend URL.')
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
      errorPayload?.error ?? errorPayload?.message ?? errorPayload?.reply ?? `Request failed (${response.status})`,
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

    events.push({ event: eventName, data: dataParts.join('\n') })
  }

  return { events, rest }
}

export async function streamChat(
  payload: ChatPayload,
  handlers: {
    onToken: (token: string) => void
  },
  options?: { auth?: boolean },
): Promise<void> {
  let response: Response

  try {
    response = await fetch(resolveApiUrl('/api/chat'), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        ...(options?.auth !== false && authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    throw new ApiError(error instanceof Error ? error.message : 'Network error', 0, error)
  }

  if (!response.ok) {
    const errorPayload = await parseErrorPayload(response)
    throw new ApiError(
      errorPayload?.error ?? errorPayload?.message ?? errorPayload?.reply ?? `Request failed (${response.status})`,
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

    throw new ApiError('Invalid chat response', response.status, json)
  }

  if (!response.body) {
    throw new ApiError('Response stream unavailable', 0)
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

export function getHealth(): Promise<{ ok: boolean; env: string; openaiKeyPresent: boolean }> {
  return requestJson('/api/health', { auth: false })
}

export function postRegister(payload: RegisterPayload): Promise<ApiOkResponse & { devToken?: string }> {
  return requestJson('/api/auth/register', { body: payload, auth: false })
}

export function postVerifyEmail(payload: { token: string }): Promise<ApiOkResponse> {
  return requestJson('/api/auth/verify-email', { body: payload, auth: false })
}

export function postLogin(payload: LoginPayload): Promise<LoginResponse> {
  return requestJson('/api/auth/login', { body: payload, auth: false })
}

export function postLogout(): Promise<ApiOkResponse> {
  return requestJson('/api/auth/logout', { body: {} })
}

export function getMe(): Promise<AuthMeResponse> {
  return requestJson('/api/auth/me')
}

export function postDemoLead(payload: DemoLeadPayload): Promise<ApiOkResponse> {
  return requestJson('/api/leads/demo', { body: payload, auth: false })
}

export function postContactLead(payload: ContactLeadPayload): Promise<ApiOkResponse> {
  return requestJson('/api/leads/contact', { body: payload, auth: false })
}

export function postChatLog(payload: ChatLogPayload): Promise<ApiOkResponse> {
  return requestJson('/api/chat/log', { body: payload, auth: false })
}

export function getDashboardSummary(): Promise<{ ok: true; summary: DashboardSummary; recent_sessions: unknown[]; plan: Plan; subscription: Subscription }> {
  return requestJson('/api/dashboard/summary')
}

export function getDashboardPlan(): Promise<{ ok: true; plan: Plan; subscription: Subscription }> {
  return requestJson('/api/dashboard/plan')
}

export function postDashboardProfile(payload: {
  business_name: string
  website_url?: string | null
}): Promise<{ ok: true; client: AuthClient }> {
  return requestJson('/api/dashboard/profile', { body: payload })
}

export function getDashboardChatbots(): Promise<{ ok: true; chatbots: DashboardChatbot[] }> {
  return requestJson('/api/dashboard/chatbots')
}

export function postDashboardChatbot(payload: {
  name: string
  website_url?: string | null
  allowed_domains?: string[]
  is_active?: boolean
}): Promise<{ ok: true; chatbot: DashboardChatbot }> {
  return requestJson('/api/dashboard/chatbots', { body: payload })
}

export function patchDashboardChatbot(
  chatbotId: string,
  payload: {
    name?: string
    website_url?: string | null
    allowed_domains?: string[]
    is_active?: boolean
  },
): Promise<{ ok: true; chatbot: DashboardChatbot }> {
  return requestJson(`/api/dashboard/chatbots/${encodeURIComponent(chatbotId)}`, {
    method: 'PATCH',
    body: payload,
  })
}

export function deleteDashboardChatbot(chatbotId: string): Promise<ApiOkResponse> {
  return requestJson(`/api/dashboard/chatbots/${encodeURIComponent(chatbotId)}`, {
    method: 'DELETE',
  })
}

export function getDashboardEmbed(chatbotId: string): Promise<{ ok: true; snippet: string; chatbot: Pick<DashboardChatbot, 'id' | 'name' | 'widget_public_key'> }> {
  return requestJson(`/api/dashboard/embed/${encodeURIComponent(chatbotId)}`)
}

export function postRagIngestStart(payload: {
  chatbotId: string
  websiteUrl: string
  maxPages?: number
  urls?: string[]
}): Promise<{ ok: true; runId: string; status: 'running' }> {
  return requestJson('/api/rag/ingest/start', { body: payload })
}

export function postRagIngestResync(payload: {
  chatbotId: string
  websiteUrl?: string
  maxPages?: number
  urls?: string[]
}): Promise<{ ok: true; runId: string; status: 'running' }> {
  return requestJson('/api/rag/ingest/resync', { body: payload })
}

export function getRagIngestStatus(runId: string): Promise<{ ok: true; run: RagIngestionRun }> {
  return requestJson(`/api/rag/ingest/status?runId=${encodeURIComponent(runId)}`)
}

export function postRagIngestCancel(runId: string): Promise<{ ok: true; runId: string; status: 'cancel_requested' }> {
  return requestJson('/api/rag/ingest/cancel', {
    body: { runId },
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
  knowledge_base_text?: string | null
}): Promise<{ ok: true; knowledge: DashboardKnowledge }> {
  return requestJson('/api/dashboard/knowledge', { body: payload })
}

export function getDashboardTickets(): Promise<{ ok: true; tickets: DashboardTicket[] }> {
  return requestJson('/api/dashboard/tickets')
}

export function postDashboardTicket(payload: {
  subject: string
  message: string
}): Promise<{ ok: true; ticket: DashboardTicket }> {
  return requestJson('/api/dashboard/tickets', { body: payload })
}

export function patchDashboardTicket(ticketId: string, payload: {
  status: 'open' | 'closed'
}): Promise<{ ok: true; ticket: DashboardTicket }> {
  return requestJson(`/api/dashboard/tickets/${encodeURIComponent(ticketId)}`, {
    method: 'PATCH',
    body: payload,
  })
}

export function getDashboardQuotes(): Promise<{ ok: true; quotes: DashboardQuote[] }> {
  return requestJson('/api/dashboard/quotes')
}

export function postDashboardQuote(payload: {
  requested_plan?: 'starter' | 'pro' | 'business'
  requested_chatbots?: number
  requested_unlimited_messages?: boolean
  notes: string
}): Promise<{ ok: true; quote: DashboardQuote }> {
  return requestJson('/api/dashboard/quotes', { body: payload })
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

export function patchDashboardLeadStatus(leadId: string, status: string): Promise<{ ok: true; lead: DashboardLead }> {
  return requestJson(`/api/dashboard/leads/${encodeURIComponent(leadId)}`, {
    method: 'PATCH',
    body: { status },
  })
}

export function getWidgetConfig(key: string): Promise<{ ok: true; config: { chatbot_id: string; widget_public_key: string; business_name: string; greeting: string; allowed_domains: string[] } }> {
  return requestJson(`/api/widget/config?key=${encodeURIComponent(key)}`, { auth: false })
}

export function getAdminOverview(): Promise<{ ok: true; overview: AdminOverview }> {
  return requestJson('/api/admin/overview')
}

export function getAdminMessages(params?: {
  limit?: number
  offset?: number
  user_id?: string
  chatbot_id?: string
  from?: string
  to?: string
}): Promise<{ ok: true; messages: Array<Record<string, unknown>>; pagination: { limit: number; offset: number; total: number } }> {
  const query = new URLSearchParams()
  if (params?.limit !== undefined) query.set('limit', String(params.limit))
  if (params?.offset !== undefined) query.set('offset', String(params.offset))
  if (params?.user_id) query.set('user_id', params.user_id)
  if (params?.chatbot_id) query.set('chatbot_id', params.chatbot_id)
  if (params?.from) query.set('from', params.from)
  if (params?.to) query.set('to', params.to)
  const suffix = query.toString() ? `?${query.toString()}` : ''
  return requestJson(`/api/admin/messages${suffix}`)
}

export function getAdminMessagesExportUrl(params?: {
  user_id?: string
  chatbot_id?: string
  from?: string
  to?: string
}): string {
  const query = new URLSearchParams()
  if (params?.user_id) query.set('user_id', params.user_id)
  if (params?.chatbot_id) query.set('chatbot_id', params.chatbot_id)
  if (params?.from) query.set('from', params.from)
  if (params?.to) query.set('to', params.to)
  const suffix = query.toString() ? `?${query.toString()}` : ''
  return `${resolveApiUrl('/api/admin/messages/export')}${suffix}`
}

export function getAdminTickets(): Promise<{ ok: true; tickets: DashboardTicket[] }> {
  return requestJson('/api/admin/tickets')
}

export function patchAdminTicket(ticketId: string, payload: {
  status?: 'open' | 'closed'
  admin_response?: string
}): Promise<{ ok: true; ticket: DashboardTicket }> {
  return requestJson(`/api/admin/tickets/${encodeURIComponent(ticketId)}`, {
    method: 'PATCH',
    body: payload,
  })
}

export function getAdminQuotes(): Promise<{ ok: true; quotes: DashboardQuote[] }> {
  return requestJson('/api/admin/quotes')
}

export function patchAdminQuote(quoteId: string, payload: {
  status?: 'pending' | 'responded' | 'closed' | 'approved'
  admin_response?: string
  approve_plan?: 'free' | 'starter' | 'pro' | 'business'
}): Promise<{ ok: true; quote: DashboardQuote }> {
  return requestJson(`/api/admin/quotes/${encodeURIComponent(quoteId)}`, {
    method: 'PATCH',
    body: payload,
  })
}

export function postAdminSetPlan(userId: string, payload: {
  plan_code: 'free' | 'starter' | 'pro' | 'business'
}): Promise<{ ok: true; subscription: Subscription }> {
  return requestJson(`/api/admin/subscriptions/${encodeURIComponent(userId)}/set-plan`, {
    method: 'POST',
    body: payload,
  })
}

export function postAdminResetPeriods(): Promise<{ ok: true; reset_count: number }> {
  return requestJson('/api/admin/maintenance/reset-periods', {
    method: 'POST',
    body: {},
  })
}

export function getAdminImpersonate(userId: string): Promise<{
  ok: true
  user: { id: string; email: string; role: string } | null
  client: { id: string; business_name: string; website_url: string | null; plan: string } | null
}> {
  return requestJson(`/api/admin/impersonate/${encodeURIComponent(userId)}`)
}

export function verifyAccount(params: { token: string }): Promise<ApiOkResponse> {
  return postVerifyEmail({ token: params.token })
}
