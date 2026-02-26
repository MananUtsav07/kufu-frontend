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
  getMe,
  postLogin,
  postLogout,
  postRegister,
  postVerifyEmail,
  setApiAuthToken,
  type AuthClient,
  type AuthUser,
} from './api'

const TOKEN_STORAGE_KEY = 'kufu_auth_token_v1'

export type SessionUser = {
  id: string
  email: string
  isVerified: boolean
}

export type SessionClient = {
  id: string
  businessName: string
  websiteUrl: string | null
  plan: string
}

type RegisterInput = {
  email: string
  password: string
  businessName?: string
  websiteUrl?: string
}

type AuthContextValue = {
  user: SessionUser | null
  client: SessionClient | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  logout: () => Promise<void>
  refreshMe: () => Promise<void>
  setToken: (token: string | null) => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<{ requiresEmailConfirmation: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function toSessionUser(user: AuthUser): SessionUser {
  return {
    id: user.id,
    email: user.email,
    isVerified: Boolean(user.is_verified),
  }
}

function toSessionClient(client: AuthClient): SessionClient {
  return {
    id: client.id,
    businessName: client.business_name,
    websiteUrl: client.website_url,
    plan: client.plan,
  }
}

function readStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  const value = window.localStorage.getItem(TOKEN_STORAGE_KEY)
  return value?.trim() ? value : null
}

function writeStoredToken(token: string | null) {
  if (typeof window === 'undefined') {
    return
  }
  if (!token) {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    return
  }
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setTokenState] = useState<string | null>(() => readStoredToken())
  const [user, setUser] = useState<SessionUser | null>(null)
  const [client, setClient] = useState<SessionClient | null>(null)
  const [loading, setLoading] = useState(true)
  const tokenRef = useRef<string | null>(token)

  const setToken = useCallback((nextToken: string | null) => {
    tokenRef.current = nextToken
    setTokenState(nextToken)
    writeStoredToken(nextToken)
    setApiAuthToken(nextToken)
  }, [])

  const clearSession = useCallback(() => {
    setUser(null)
    setClient(null)
    setToken(null)
  }, [setToken])

  const refreshMe = useCallback(async () => {
    if (!tokenRef.current) {
      setUser(null)
      setClient(null)
      return
    }

    try {
      const response = await getMe()
      setUser(toSessionUser(response.user))
      setClient(toSessionClient(response.client))
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        clearSession()
        return
      }
      throw error
    }
  }, [clearSession])

  useEffect(() => {
    setApiAuthToken(token)
    tokenRef.current = token
  }, [token])

  useEffect(() => {
    let mounted = true
    void (async () => {
      try {
        await refreshMe()
      } catch (error) {
        console.error('[auth] failed to restore session', error)
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
  }, [clearSession, refreshMe])

  const login = useCallback(async (email: string, password: string) => {
    const response = await postLogin({ email, password })
    setToken(response.token)
    setUser(toSessionUser(response.user))
    setClient(toSessionClient(response.client))
  }, [setToken])

  const register = useCallback(async (input: RegisterInput) => {
    await postRegister({
      email: input.email,
      password: input.password,
      business_name: input.businessName,
      website_url: input.websiteUrl,
    })
  }, [])

  const verifyEmail = useCallback(async (verificationToken: string) => {
    await postVerifyEmail({ token: verificationToken })
  }, [])

  const logout = useCallback(async () => {
    try {
      await postLogout()
    } finally {
      clearSession()
    }
  }, [clearSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      client,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      verifyEmail,
      logout,
      refreshMe,
      setToken,
      signIn: login,
      signUp: async (email: string, password: string, name?: string) => {
        await register({
          email,
          password,
          businessName: name,
        })
        return { requiresEmailConfirmation: true }
      },
      signOut: logout,
    }),
    [client, loading, login, logout, refreshMe, register, setToken, token, user, verifyEmail],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
