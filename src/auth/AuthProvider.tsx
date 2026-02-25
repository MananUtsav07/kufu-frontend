import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { ApiError, getMe, postLogin, postLogout, postRegister, type AuthUser } from '../lib/api'

type RegisterResult = {
  requiresEmailConfirmation: boolean
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<RegisterResult>
  logout: () => Promise<void>
  refreshMe: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<RegisterResult>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshMe = useCallback(async () => {
    try {
      const response = await getMe()
      setUser(response.user)
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setUser(null)
        return
      }

      throw error
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    void (async () => {
      try {
        await refreshMe()
      } catch (error) {
        console.error('[auth] failed to load current user', error)
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    })()

    return () => {
      isMounted = false
    }
  }, [refreshMe])

  const login = useCallback(async (email: string, password: string) => {
    const response = await postLogin({ email, password })
    setUser(response.user)
  }, [])

  const register = useCallback(async (email: string, password: string, name?: string) => {
    await postRegister({ email, password, name })
    return { requiresEmailConfirmation: true }
  }, [])

  const logout = useCallback(async () => {
    try {
      await postLogout()
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refreshMe,
      signIn: login,
      signUp: register,
      signOut: logout,
    }),
    [loading, login, logout, refreshMe, register, user],
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
