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
  token?: string | null
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
  full_name: string
  business_name: string
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
  websiteUrl?: string
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
  requested_monthly_messages: number | null
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
  logo_path: string | null
  logo_updated_at: string | null
  is_active: boolean
  created_at: string
}

export type DashboardKbFile = {
  id: string
  chatbot_id: string
  user_id: string
  filename: string
  mime_type: string
  storage_path: string
  file_size: number
  created_at: string
}

export type DashboardWhatsAppIntegration = {
  id: string
  chatbot_id: string
  phone_number_id: string
  business_account_id: string | null
  display_phone_number: string | null
  verify_token: string
  is_active: boolean
  last_inbound_at: string | null
  created_at: string
  updated_at: string
  has_access_token: boolean
}

export type DashboardChatHistoryRow = {
  id: string
  chatbot_id: string
  visitor_id: string
  user_message: string
  bot_response: string
  lead_captured: boolean
  created_at: string
}

export type DashboardAnalyticsResponse = {
  totalChats: number
  popularQuestions: Array<{
    question: string
    count: number
  }>
  peakHours: Array<{
    hour: number
    count: number
  }>
}

export type ChatbotSettings = {
  chatbot_id: string
  bot_name: string
  greeting_message: string
  primary_color: string
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

export type AdminUserListItem = {
  id: string
  email: string
  role: 'user' | 'admin'
  is_verified: boolean
  created_at: string
  currentPlanCode: 'free' | 'starter' | 'pro' | 'business' | string
  messageUsageThisPeriod: number
}

export type PropertyOwnerSummary = {
  activeTenants: number
  openTickets: number
  overdueRent: number
  escalatedChats: number
  remindersPending: number
}

export type PropertyTenantListItem = {
  id: string
  owner_id: string
  property_id: string
  full_name: string
  email: string
  phone: string | null
  tenant_access_id: string
  lease_start_date: string | null
  lease_end_date: string | null
  monthly_rent: number
  payment_due_day: number
  payment_status: 'pending' | 'paid' | 'overdue' | 'partial'
  status: 'active' | 'inactive' | 'terminated'
  created_at: string
  property: {
    id: string
    property_name: string
    address: string
    unit_number: string | null
  } | null
}

export type PropertyTenantTicket = {
  id: string
  tenant_id: string
  owner_id: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  created_at: string
  updated_at: string
}

export type PropertyTenantMessage = {
  id: string
  tenant_id: string
  owner_id: string
  sender_type: 'tenant' | 'bot' | 'owner'
  message: string
  intent: string | null
  escalated: boolean
  created_at: string
}

export type PropertyRentReminder = {
  id: string
  tenant_id: string
  owner_id: string
  reminder_type: '7_days_before' | '1_day_before' | 'due_today' | '3_days_late' | '7_days_late'
  scheduled_for: string
  sent_at: string | null
  status: 'pending' | 'sent' | 'failed' | 'canceled'
  created_at: string
}

export type PropertyOwnerNotification = {
  id: string
  owner_id: string
  tenant_id: string | null
  notification_type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export type PropertyTenantSessionUser = {
  id: string
  owner_id: string
  property_id: string
  full_name: string
  email: string
  phone: string | null
  tenant_access_id: string
  lease_start_date: string | null
  lease_end_date: string | null
  monthly_rent: number
  payment_due_day: number
  payment_status: 'pending' | 'paid' | 'overdue' | 'partial'
  status: 'active' | 'inactive' | 'terminated'
  created_at: string
}

export type PropertyTenantMeResponse = {
  ok: true
  tenant: PropertyTenantSessionUser
  property: {
    id: string
    owner_id: string
    property_name: string
    address: string
    unit_number: string | null
    created_at: string
  } | null
  owner: {
    id: string
    company_name: string
    support_email: string
    support_whatsapp: string | null
  }
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

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  } else if (options.auth !== false && authToken) {
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

async function requestFormData<TResponse>(
  path: string,
  formData: FormData,
  method: 'POST' | 'PATCH' = 'POST',
  tokenOverride?: string | null,
): Promise<TResponse> {
  const headers = new Headers()
  headers.set('Accept', 'application/json')

  if (tokenOverride) {
    headers.set('Authorization', `Bearer ${tokenOverride}`)
  } else if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  let response: Response
  try {
    response = await fetch(resolveApiUrl(path), {
      method,
      headers,
      credentials: 'include',
      body: formData,
    })
  } catch (error) {
    throw new ApiError(error instanceof Error ? error.message : 'Network error', 0, error)
  }

  if (!response.ok) {
    const errorPayload = await parseErrorPayload(response)
    throw new ApiError(
      errorPayload?.error ?? errorPayload?.message ?? `Request failed (${response.status})`,
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

export function getDashboardChatbotLogo(chatbotId: string): Promise<{ ok: true; logoUrl: string | null }> {
  return requestJson(`/api/dashboard/chatbots/${encodeURIComponent(chatbotId)}/logo`)
}

export function postDashboardChatbotLogo(chatbotId: string, file: File): Promise<{ ok: true; logoUrl: string | null }> {
  const formData = new FormData()
  formData.append('file', file)
  return requestFormData(`/api/dashboard/chatbots/${encodeURIComponent(chatbotId)}/logo`, formData, 'POST')
}

export function deleteDashboardChatbotLogo(chatbotId: string): Promise<ApiOkResponse> {
  return requestJson(`/api/dashboard/chatbots/${encodeURIComponent(chatbotId)}/logo`, {
    method: 'DELETE',
  })
}

export function getDashboardKbFiles(chatbotId: string): Promise<{ ok: true; files: DashboardKbFile[] }> {
  return requestJson(`/api/dashboard/chatbots/${encodeURIComponent(chatbotId)}/kb-files`)
}

export function postDashboardKbFile(chatbotId: string, file: File): Promise<{ ok: true; file: DashboardKbFile }> {
  const formData = new FormData()
  formData.append('file', file)
  return requestFormData(`/api/dashboard/chatbots/${encodeURIComponent(chatbotId)}/kb-files`, formData, 'POST')
}

export function deleteDashboardKbFile(fileId: string): Promise<ApiOkResponse> {
  return requestJson(`/api/dashboard/kb-files/${encodeURIComponent(fileId)}`, {
    method: 'DELETE',
  })
}

export function getDashboardEmbed(chatbotId: string): Promise<{ ok: true; snippet: string; chatbot: Pick<DashboardChatbot, 'id' | 'name' | 'widget_public_key'> }> {
  return requestJson(`/api/dashboard/embed/${encodeURIComponent(chatbotId)}`)
}

export function getDashboardWhatsAppIntegration(): Promise<{
  ok: true
  webhookUrl: string
  integration: DashboardWhatsAppIntegration | null
}> {
  return requestJson('/api/dashboard/whatsapp')
}

export function postDashboardWhatsAppConnect(payload: {
  chatbotId: string
  phoneNumberId: string
  businessAccountId?: string
  displayPhoneNumber?: string
  accessToken?: string
  verifyToken?: string
  webhookSecret?: string
  isActive?: boolean
}): Promise<{
  ok: true
  webhookUrl: string
  integration: DashboardWhatsAppIntegration
}> {
  return requestJson('/api/dashboard/whatsapp/connect', { body: payload })
}

export function postDashboardWhatsAppTestMessage(payload: {
  to: string
  message: string
}): Promise<{ ok: true; providerMessageId: string | null }> {
  return requestJson('/api/dashboard/whatsapp/test-message', { body: payload })
}

export function deleteDashboardWhatsAppIntegration(): Promise<ApiOkResponse> {
  return requestJson('/api/dashboard/whatsapp', {
    method: 'DELETE',
  })
}

export function getDashboardChatHistory(
  chatbotId: string,
  params?: {
    from?: string
    to?: string
    leadCaptured?: 'yes' | 'no'
    limit?: number
    offset?: number
  },
): Promise<{ ok: true; rows: DashboardChatHistoryRow[]; pagination: { limit: number; offset: number; total: number } }> {
  const query = new URLSearchParams()
  if (params?.from) query.set('from', params.from)
  if (params?.to) query.set('to', params.to)
  if (params?.leadCaptured) query.set('leadCaptured', params.leadCaptured)
  if (params?.limit !== undefined) query.set('limit', String(params.limit))
  if (params?.offset !== undefined) query.set('offset', String(params.offset))
  const suffix = query.toString() ? `?${query.toString()}` : ''
  return requestJson(`/api/dashboard/chat-history/${encodeURIComponent(chatbotId)}${suffix}`)
}

export function searchDashboardChatHistory(params: {
  chatbotId: string
  q: string
  from?: string
  to?: string
  leadCaptured?: 'yes' | 'no'
  limit?: number
  offset?: number
}): Promise<{ ok: true; rows: DashboardChatHistoryRow[]; pagination: { limit: number; offset: number; total: number } }> {
  const query = new URLSearchParams()
  query.set('chatbotId', params.chatbotId)
  query.set('q', params.q)
  if (params.from) query.set('from', params.from)
  if (params.to) query.set('to', params.to)
  if (params.leadCaptured) query.set('leadCaptured', params.leadCaptured)
  if (params.limit !== undefined) query.set('limit', String(params.limit))
  if (params.offset !== undefined) query.set('offset', String(params.offset))
  return requestJson(`/api/dashboard/chat-history/search?${query.toString()}`)
}

export function getDashboardAnalytics(
  chatbotId: string,
  params?: {
    from?: string
    to?: string
  },
): Promise<{ ok: true } & DashboardAnalyticsResponse> {
  const query = new URLSearchParams()
  if (params?.from) query.set('from', params.from)
  if (params?.to) query.set('to', params.to)
  const suffix = query.toString() ? `?${query.toString()}` : ''
  return requestJson(`/api/dashboard/analytics/${encodeURIComponent(chatbotId)}${suffix}`)
}

export function postDashboardTestChat(
  chatbotId: string,
  payload: {
    sessionId?: string
    messages: Array<{
      role: 'user' | 'assistant'
      content: string
    }>
  },
): Promise<{ ok: true; reply: string; chatbotId: string; usage?: Subscription | null }> {
  return requestJson(`/api/dashboard/test-chat/${encodeURIComponent(chatbotId)}`, {
    method: 'POST',
    body: payload,
  })
}

export function getChatbotSettings(chatbotId: string): Promise<{ ok: true; settings: ChatbotSettings }> {
  return requestJson(`/api/chatbot/settings/${encodeURIComponent(chatbotId)}`)
}

export function putChatbotSettings(
  chatbotId: string,
  payload: {
    bot_name: string
    greeting_message: string
    primary_color: string
  },
): Promise<{ ok: true; settings: ChatbotSettings }> {
  return requestJson(`/api/chatbot/settings/${encodeURIComponent(chatbotId)}`, {
    method: 'PUT',
    body: payload,
  })
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

export function getRagIngestLatest(chatbotId: string): Promise<{ ok: true; run: RagIngestionRun | null }> {
  return requestJson(`/api/rag/ingest/latest?chatbotId=${encodeURIComponent(chatbotId)}`)
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
  requested_plan?: 'starter' | 'pro' | 'business' | null
  requested_chatbots?: number
  requested_monthly_messages?: number
  requested_unlimited_messages?: boolean
  notes: string
}): Promise<{ ok: true; quote: DashboardQuote }> {
  return requestJson('/api/dashboard/quotes', { body: payload })
}

export function getChatbotByUser(userId: string): Promise<{
  ok: true
  userId: string
  hasChatbot: boolean
  chatbotCount: number
  chatbots: Array<{
    id: string
    name: string
    is_active: boolean
  }>
}> {
  return requestJson(`/api/chatbot/user/${encodeURIComponent(userId)}`)
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

export function getPropertyOwnerDashboardSummary(): Promise<{ ok: true; summary: PropertyOwnerSummary }> {
  return requestJson('/api/property-management/owner/dashboard-summary')
}

export function getPropertyOwnerTenants(): Promise<{ ok: true; tenants: PropertyTenantListItem[] }> {
  return requestJson('/api/property-management/owner/tenants')
}

export function postPropertyOwnerTenant(payload: {
  property_id?: string
  property_name?: string
  address?: string
  unit_number?: string
  full_name: string
  email: string
  phone?: string
  password?: string
  lease_start_date?: string
  lease_end_date?: string
  monthly_rent: number | string
  payment_due_day: number
  payment_status?: 'pending' | 'paid' | 'overdue' | 'partial'
  status?: 'active' | 'inactive' | 'terminated'
}): Promise<{
  ok: true
  tenant: PropertyTenantSessionUser
  credentials: {
    tenant_access_id: string
    password: string
    generated: boolean
  }
}> {
  return requestJson('/api/property-management/owner/tenants', { body: payload })
}

export function getPropertyOwnerTenantDetail(tenantId: string): Promise<{
  ok: true
  detail: {
    tenant: PropertyTenantSessionUser
    property: PropertyTenantMeResponse['property']
    tickets: PropertyTenantTicket[]
    reminders: PropertyRentReminder[]
    messages: PropertyTenantMessage[]
  }
}> {
  return requestJson(`/api/property-management/owner/tenants/${encodeURIComponent(tenantId)}`)
}

export function getPropertyOwnerTickets(): Promise<{ ok: true; tickets: PropertyTenantTicket[] }> {
  return requestJson('/api/property-management/owner/tickets')
}

export function patchPropertyOwnerTicketStatus(
  ticketId: string,
  status: 'open' | 'in_progress' | 'resolved' | 'closed',
): Promise<{ ok: true; ticket: PropertyTenantTicket }> {
  return requestJson(`/api/property-management/owner/tickets/${encodeURIComponent(ticketId)}`, {
    method: 'PATCH',
    body: { status },
  })
}

export function getPropertyOwnerNotifications(): Promise<{ ok: true; notifications: PropertyOwnerNotification[] }> {
  return requestJson('/api/property-management/owner/notifications')
}

export function postPropertyTenantLogin(payload: {
  tenant_access_id: string
  password: string
  email?: string
}): Promise<{
  ok: true
  token: string
  tenant: PropertyTenantSessionUser
  property: PropertyTenantMeResponse['property']
  owner: PropertyTenantMeResponse['owner']
}> {
  return requestJson('/api/property-management/tenant/login', {
    method: 'POST',
    body: payload,
    auth: false,
  })
}

export function getPropertyTenantMe(token: string): Promise<PropertyTenantMeResponse> {
  return requestJson('/api/property-management/tenant/me', {
    token,
    auth: false,
  })
}

export function getPropertyTenantDashboardSummary(token: string): Promise<{
  ok: true
  summary: {
    openTickets: number
    recentMessages: number
    pendingReminders: number
    paymentStatus: 'pending' | 'paid' | 'overdue' | 'partial'
    monthlyRent: number
    dueDay: number
  }
  tenant: PropertyTenantSessionUser
  property: PropertyTenantMeResponse['property']
}> {
  return requestJson('/api/property-management/tenant/dashboard-summary', {
    token,
    auth: false,
  })
}

export function postPropertyTenantTicket(
  token: string,
  payload: { subject: string; message: string },
): Promise<{ ok: true; ticket: PropertyTenantTicket }> {
  return requestJson('/api/property-management/tenant/tickets', {
    token,
    auth: false,
    body: payload,
  })
}

export function getPropertyTenantTickets(token: string): Promise<{ ok: true; tickets: PropertyTenantTicket[] }> {
  return requestJson('/api/property-management/tenant/tickets', {
    token,
    auth: false,
  })
}

export function getPropertyTenantMessages(token: string): Promise<{ ok: true; messages: PropertyTenantMessage[] }> {
  return requestJson('/api/property-management/tenant/messages', {
    token,
    auth: false,
  })
}

export function postPropertyTenantChat(
  token: string,
  payload: { message: string },
): Promise<{ ok: true; reply: string; intent: string; escalated: boolean }> {
  return requestJson('/api/property-management/tenant/chat', {
    token,
    auth: false,
    body: payload,
  })
}

export function getPropertyTenantOwnerContact(token: string): Promise<{
  ok: true
  owner: PropertyTenantMeResponse['owner']
  whatsapp: {
    ownerId: string
    tenantId: string
    supportWhatsApp: string | null
    messageTemplate: string
  }
}> {
  return requestJson('/api/property-management/tenant/owner-contact', {
    token,
    auth: false,
  })
}

export function postPropertyProcessReminders(payload?: { referenceDate?: string }): Promise<{
  ok: true
  result: {
    processed: number
    pending: number
  }
}> {
  return requestJson('/api/property-management/system/process-reminders', {
    method: 'POST',
    body: payload ?? {},
  })
}

export function getWidgetConfig(key: string): Promise<{
  ok: true
  config: {
    chatbot_id: string
    widget_public_key: string
    name?: string
    business_name: string
    greeting: string
    primary_color?: string
    logo_url?: string | null
    allowed_domains: string[]
  }
}> {
  return requestJson(`/api/widget/config?key=${encodeURIComponent(key)}`, { auth: false })
}

export function getAdminOverview(): Promise<{ ok: true; overview: AdminOverview }> {
  return requestJson('/api/admin/overview')
}

export function getAdminUsers(): Promise<{ ok: true; users: AdminUserListItem[] }> {
  return requestJson('/api/admin/users')
}

export function postAdminUserPlan(userId: string, payload: {
  planCode: 'free' | 'starter' | 'pro' | 'business'
}): Promise<{ ok: true; subscription: Subscription }> {
  return requestJson(`/api/admin/users/${encodeURIComponent(userId)}/plan`, {
    method: 'POST',
    body: payload,
  })
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
