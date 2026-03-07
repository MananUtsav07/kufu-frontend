import { useEffect, useState } from 'react'

import {
  ApiError,
  getPropertyTenantOwnerContact,
  type PropertyTenantMeResponse,
} from '../lib/api'
import { useTenantAuth } from './tenant-auth-context'

type OwnerSupportState = {
  owner: PropertyTenantMeResponse['owner']
  whatsapp: {
    ownerId: string
    tenantId: string
    supportWhatsApp: string | null
    messageTemplate: string
  }
}

export function PropertyTenantSupportPage() {
  const { token } = useTenantAuth()
  const [state, setState] = useState<OwnerSupportState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    let mounted = true
    void (async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getPropertyTenantOwnerContact(token)
        if (mounted) {
          setState(response)
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError instanceof ApiError ? requestError.message : 'Failed to load owner contact.')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    })()

    return () => {
      mounted = false
    }
  }, [token])

  const whatsappDeepLink = state?.whatsapp.supportWhatsApp
    ? `https://wa.me/${state.whatsapp.supportWhatsApp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(state.whatsapp.messageTemplate)}`
    : null

  return (
    <section className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-black text-white sm:text-3xl">Owner Support Contact</h1>
        <p className="text-sm text-slate-400">Direct communication details from property owner.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
      ) : null}

      {loading || !state ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-sm text-slate-400">Loading contact details...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Company</p>
            <p className="mt-1 text-base font-semibold text-white">{state.owner.company_name}</p>

            <p className="mt-4 text-[11px] uppercase tracking-wide text-slate-500">Support Email</p>
            <a className="mt-1 inline-block text-sm text-indigo-300 hover:text-indigo-200" href={`mailto:${state.owner.support_email}`}>
              {state.owner.support_email}
            </a>
          </article>

          <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Support WhatsApp</p>
            <p className="mt-1 text-sm text-white">{state.whatsapp.supportWhatsApp || 'Not configured'}</p>
            {whatsappDeepLink ? (
              <a
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-500/35 bg-emerald-500/15 px-3 py-1.5 text-sm font-semibold text-emerald-200 transition-colors hover:bg-emerald-500/25"
                href={whatsappDeepLink}
                rel="noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                Message on WhatsApp
              </a>
            ) : (
              <p className="mt-3 text-xs text-slate-500">WhatsApp support is not enabled yet.</p>
            )}
          </article>
        </div>
      )}
    </section>
  )
}
