import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import {
  ApiError,
  getWhatsAppOnboardingStatus,
  postWhatsAppOnboardingComplete,
  postWhatsAppOnboardingStart,
  postWhatsAppWebhookSubscribe,
  type WhatsAppOnboardingStartResponse,
} from '../lib/api'

type FacebookAuthResponse = {
  accessToken?: string
  code?: string
  expiresIn?: number
  signedRequest?: string
  userID?: string
}

type FacebookLoginResponse = {
  status?: string
  authResponse?: FacebookAuthResponse
}

type MetaSdk = {
  init: (args: Record<string, unknown>) => void
  login: (
    callback: (response: FacebookLoginResponse) => void,
    options?: Record<string, unknown>,
  ) => void
}

declare global {
  interface Window {
    FB?: MetaSdk
    fbAsyncInit?: () => void
  }
}

let sdkPromise: Promise<MetaSdk> | null = null

function normalizeGraphVersion(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    return 'v22.0'
  }
  return trimmed.startsWith('v') ? trimmed : `v${trimmed}`
}

function ensureMetaSdk(appId: string, graphApiVersion: string): Promise<MetaSdk> {
  if (window.FB) {
    window.FB.init({
      appId,
      cookie: true,
      xfbml: false,
      version: normalizeGraphVersion(graphApiVersion),
    })
    return Promise.resolve(window.FB)
  }

  if (sdkPromise) {
    return sdkPromise
  }

  sdkPromise = new Promise((resolve, reject) => {
    window.fbAsyncInit = () => {
      if (!window.FB) {
        reject(new Error('Meta SDK failed to initialize'))
        return
      }

      window.FB.init({
        appId,
        cookie: true,
        xfbml: false,
        version: normalizeGraphVersion(graphApiVersion),
      })
      resolve(window.FB)
    }

    const existingScript = document.getElementById('facebook-jssdk')
    if (existingScript) {
      return
    }

    const script = document.createElement('script')
    script.id = 'facebook-jssdk'
    script.async = true
    script.defer = true
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    script.onerror = () => {
      reject(new Error('Failed to load Meta SDK script'))
      sdkPromise = null
    }
    document.body.appendChild(script)
  })

  return sdkPromise
}

function normalizeString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function collectNestedStringMatches(
  value: unknown,
  wantedKeys: Set<string>,
  output: string[],
) {
  if (!value || typeof value !== 'object') {
    return
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectNestedStringMatches(item, wantedKeys, output)
    }
    return
  }

  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    if (wantedKeys.has(key)) {
      const normalized = normalizeString(nested)
      if (normalized) {
        output.push(normalized)
      }
    }
    collectNestedStringMatches(nested, wantedKeys, output)
  }
}

function extractEmbeddedHints(payload: unknown): {
  businessAccountId: string | null
  phoneNumberId: string | null
  displayPhoneNumber: string | null
} {
  const businessIds: string[] = []
  const phoneIds: string[] = []
  const displayPhones: string[] = []

  collectNestedStringMatches(
    payload,
    new Set(['waba_id', 'whatsapp_business_account_id', 'business_account_id']),
    businessIds,
  )
  collectNestedStringMatches(
    payload,
    new Set(['phone_number_id', 'business_phone_number_id']),
    phoneIds,
  )
  collectNestedStringMatches(
    payload,
    new Set(['display_phone_number']),
    displayPhones,
  )

  return {
    businessAccountId: businessIds[0] ?? null,
    phoneNumberId: phoneIds[0] ?? null,
    displayPhoneNumber: displayPhones[0] ?? null,
  }
}

export function DashboardWhatsAppConnectPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const embeddedEventsRef = useRef<unknown[]>([])

  const [loading, setLoading] = useState(true)
  const [launching, setLaunching] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [retryingSubscribe, setRetryingSubscribe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [onboarding, setOnboarding] = useState<WhatsAppOnboardingStartResponse['onboarding'] | null>(null)
  const [chatbots, setChatbots] = useState<Array<{ id: string; name: string }>>([])
  const [selectedChatbotId, setSelectedChatbotId] = useState('')
  const [alreadyConnected, setAlreadyConnected] = useState(false)

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search])
  const sourceChatbotId = searchParams.get('chatbotId')?.trim() || ''
  const callbackStatus = searchParams.get('status')?.trim() || ''
  const callbackReason = searchParams.get('reason')?.trim() || ''
  const publicMetaAppId =
    typeof import.meta.env.VITE_META_APP_ID === 'string' && import.meta.env.VITE_META_APP_ID.trim().length > 0
      ? import.meta.env.VITE_META_APP_ID.trim()
      : ''

  useEffect(() => {
    if (!callbackStatus) {
      return
    }

    if (callbackStatus.toLowerCase() === 'success') {
      setSuccess('Meta callback received. Complete the final onboarding step below.')
      return
    }

    setError(callbackReason || `Meta callback status: ${callbackStatus}`)
  }, [callbackReason, callbackStatus])

  useEffect(() => {
    let isMounted = true

    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const [statusResponse, startResponse] = await Promise.all([
          getWhatsAppOnboardingStatus(),
          postWhatsAppOnboardingStart({
            chatbotId: sourceChatbotId || undefined,
          }),
        ])

        if (!isMounted) {
          return
        }

        setAlreadyConnected(Boolean(statusResponse.connected))
        setOnboarding(startResponse.onboarding)
        setChatbots(startResponse.chatbots)

        const preferredChatbotId = sourceChatbotId || startResponse.onboarding.chatbotId || startResponse.chatbots[0]?.id || ''
        setSelectedChatbotId(preferredChatbotId)
      } catch (loadError) {
        if (!isMounted) {
          return
        }
        setError(loadError instanceof ApiError ? loadError.message : 'Failed to initialize WhatsApp onboarding.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [sourceChatbotId])

  const handleConnect = async () => {
    if (!onboarding) {
      setError('Onboarding is not initialized yet.')
      return
    }
    if (!selectedChatbotId) {
      setError('Select a chatbot before starting Embedded Signup.')
      return
    }
    const metaAppId = onboarding.metaAppId || publicMetaAppId
    if (!metaAppId || !onboarding.configId) {
      setError('Embedded Signup is not configured. Set META_APP_ID and META_EMBEDDED_SIGNUP_CONFIG_ID.')
      return
    }

    setError(null)
    setSuccess(null)
    setLaunching(true)
    embeddedEventsRef.current = []

    const messageListener = (event: MessageEvent) => {
      const isMetaOrigin =
        event.origin.includes('facebook.com') ||
        event.origin.includes('fbcdn.net') ||
        event.origin.includes('meta.com')
      if (!isMetaOrigin) {
        return
      }

      let normalizedData: unknown = event.data
      if (typeof normalizedData === 'string') {
        try {
          normalizedData = JSON.parse(normalizedData)
        } catch {
          normalizedData = event.data
        }
      }

      embeddedEventsRef.current.push({
        origin: event.origin,
        ts: new Date().toISOString(),
        payload: normalizedData,
      })
    }

    window.addEventListener('message', messageListener)

    try {
      const sdk = await ensureMetaSdk(metaAppId, onboarding.graphApiVersion)
      await new Promise<void>((resolve, reject) => {
        sdk.login(
          async (loginResponse) => {
            if (!loginResponse?.authResponse) {
              reject(new Error('Embedded signup was cancelled or did not return auth data.'))
              return
            }

            try {
              setProcessing(true)
              const combinedPayload = {
                source: 'meta_embedded_signup',
                callbackStatus,
                callbackReason,
                loginResponse,
                events: embeddedEventsRef.current,
              }
              const hints = extractEmbeddedHints(combinedPayload)
              const completeResponse = await postWhatsAppOnboardingComplete({
                chatbotId: selectedChatbotId,
                accessToken: loginResponse.authResponse.accessToken,
                code: loginResponse.authResponse.code,
                businessAccountId: hints.businessAccountId ?? undefined,
                phoneNumberId: hints.phoneNumberId ?? undefined,
                displayPhoneNumber: hints.displayPhoneNumber ?? undefined,
                verifyToken: onboarding.verifyToken,
                state: onboarding.state,
                onboardingPayload: combinedPayload,
                authResponse: {
                  accessToken: loginResponse.authResponse.accessToken,
                  code: loginResponse.authResponse.code,
                },
                isActive: true,
                autoSubscribe: true,
              })

              if (completeResponse.connected) {
                setSuccess('WhatsApp connected successfully. Redirecting to integrations...')
                window.setTimeout(() => {
                  navigate('/dashboard/integrations?wa_connected=1', { replace: true })
                }, 900)
              } else {
                setError(completeResponse.subscribe.message || 'WhatsApp connection completed, but webhook subscription failed.')
              }

              resolve()
            } catch (submitError) {
              reject(submitError)
            } finally {
              setProcessing(false)
            }
          },
          {
            config_id: onboarding.configId,
            response_type: 'code',
            override_default_response_type: true,
            extras: {
              setup: {
                business: {
                  name: 'Kufu Client Setup',
                },
              },
            },
          },
        )
      })
    } catch (connectError) {
      setError(connectError instanceof ApiError ? connectError.message : connectError instanceof Error ? connectError.message : 'Failed to complete Embedded Signup.')
    } finally {
      window.removeEventListener('message', messageListener)
      setLaunching(false)
    }
  }

  const handleRetryWebhookSubscribe = async () => {
    if (!onboarding) {
      return
    }

    setRetryingSubscribe(true)
    setError(null)
    try {
      const result = await postWhatsAppWebhookSubscribe({
        verifyToken: onboarding.verifyToken,
      })
      if (result.connected) {
        setSuccess('Webhook subscribed successfully. Redirecting to integrations...')
        window.setTimeout(() => {
          navigate('/dashboard/integrations?wa_connected=1', { replace: true })
        }, 900)
      } else {
        setError(result.subscribe.message || 'Webhook subscription is still pending.')
      }
    } catch (retryError) {
      setError(retryError instanceof ApiError ? retryError.message : 'Failed to subscribe webhook.')
    } finally {
      setRetryingSubscribe(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <p className="text-sm text-slate-300">Preparing WhatsApp onboarding...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/15 via-slate-900/80 to-sky-500/10 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-200">WhatsApp Embedded Signup</p>
        <h1 className="mt-1 font-display text-2xl font-black text-white">Connect Client WhatsApp</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Complete Meta Embedded Signup to connect your client WhatsApp number. Kufu will store account details and attempt webhook subscription automatically.
        </p>
      </div>

      {alreadyConnected ? (
        <div className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          WhatsApp is already connected for this workspace. You can reconnect if you want to change the linked number.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-rose-500/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {success}
        </div>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">Chatbot</span>
            <select
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-100"
              value={selectedChatbotId}
              onChange={(event) => setSelectedChatbotId(event.target.value)}
            >
              {chatbots.map((chatbot) => (
                <option key={chatbot.id} value={chatbot.id}>
                  {chatbot.name}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Webhook URL</p>
            <p className="mt-1 break-all text-xs text-slate-200">{onboarding?.webhookUrl || '-'}</p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Verify Token</p>
            <p className="mt-1 break-all text-xs text-slate-200">{onboarding?.verifyToken || '-'}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={launching || processing}
            type="button"
            onClick={handleConnect}
          >
            {launching || processing ? 'Connecting...' : 'Connect WhatsApp'}
          </button>
          <button
            className="rounded-lg border border-sky-500/35 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-200 transition-colors hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={retryingSubscribe}
            type="button"
            onClick={handleRetryWebhookSubscribe}
          >
            {retryingSubscribe ? 'Retrying...' : 'Retry Webhook Subscription'}
          </button>
          <Link
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/5"
            to="/dashboard/integrations"
          >
            Back to Integrations
          </Link>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs text-slate-400">
          Embedded Signup uses Meta's popup flow and requests your WhatsApp business permissions. Keep this tab open until the popup closes.
        </div>
      </section>
    </div>
  )
}
