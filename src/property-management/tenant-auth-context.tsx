import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  ApiError,
  getPropertyTenantMe,
  postPropertyTenantLogin,
  type PropertyTenantMeResponse,
  type PropertyTenantSessionUser,
} from '../lib/api'

const TENANT_TOKEN_STORAGE_KEY = 'kufu_property_tenant_token_v1'

type TenantAuthContextValue = {
  token: string | null
  tenant: PropertyTenantSessionUser | null
  property: PropertyTenantMeResponse['property'] | null
  owner: PropertyTenantMeResponse['owner'] | null
  loading: boolean
  isAuthenticated: boolean
  login: (payload: { tenantAccessId: string; password: string; email?: string }) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

const TenantAuthContext = createContext<TenantAuthContextValue | undefined>(undefined)

function readStoredTenantToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  const value = window.localStorage.getItem(TENANT_TOKEN_STORAGE_KEY)
  return value?.trim() ? value : null
}

function writeStoredTenantToken(token: string | null) {
  if (typeof window === 'undefined') {
    return
  }
  if (!token) {
    window.localStorage.removeItem(TENANT_TOKEN_STORAGE_KEY)
    return
  }
  window.localStorage.setItem(TENANT_TOKEN_STORAGE_KEY, token)
}

export function TenantAuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => readStoredTenantToken())
  const [tenant, setTenant] = useState<PropertyTenantSessionUser | null>(null)
  const [property, setProperty] = useState<PropertyTenantMeResponse['property'] | null>(null)
  const [owner, setOwner] = useState<PropertyTenantMeResponse['owner'] | null>(null)
  const [loading, setLoading] = useState(true)

  const tokenRef = useRef<string | null>(token)

  const clearSession = useCallback(() => {
    tokenRef.current = null
    setToken(null)
    setTenant(null)
    setProperty(null)
    setOwner(null)
    writeStoredTenantToken(null)
  }, [])

  const refresh = useCallback(async () => {
    if (!tokenRef.current) {
      setTenant(null)
      setProperty(null)
      setOwner(null)
      return
    }

    try {
      const response = await getPropertyTenantMe(tokenRef.current)
      setTenant(response.tenant)
      setProperty(response.property)
      setOwner(response.owner)
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        clearSession()
        return
      }
      throw error
    }
  }, [clearSession])

  useEffect(() => {
    tokenRef.current = token
    writeStoredTenantToken(token)
  }, [token])

  useEffect(() => {
    let mounted = true

    void (async () => {
      try {
        await refresh()
      } catch (error) {
        console.error('[property-tenant-auth] restore failed', error)
        if (mounted) {
          clearSession()
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
  }, [clearSession, refresh])

  const login = useCallback(async (payload: { tenantAccessId: string; password: string; email?: string }) => {
    const response = await postPropertyTenantLogin({
      tenant_access_id: payload.tenantAccessId,
      password: payload.password,
      email: payload.email?.trim() || undefined,
    })

    setToken(response.token)
    setTenant(response.tenant)
    setProperty(response.property)
    setOwner(response.owner)
  }, [])

  const logout = useCallback(() => {
    clearSession()
  }, [clearSession])

  const value = useMemo<TenantAuthContextValue>(
    () => ({
      token,
      tenant,
      property,
      owner,
      loading,
      isAuthenticated: Boolean(token && tenant),
      login,
      logout,
      refresh,
    }),
    [token, tenant, property, owner, loading, login, logout, refresh],
  )

  return <TenantAuthContext.Provider value={value}>{children}</TenantAuthContext.Provider>
}

export function useTenantAuth() {
  const context = useContext(TenantAuthContext)
  if (!context) {
    throw new Error('useTenantAuth must be used within TenantAuthProvider')
  }
  return context
}
