import type { Session, User } from '@supabase/supabase-js'
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { supabase } from '../lib/supabaseClient'

type AuthContextValue = {
  session: Session | null
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<{ requiresEmailConfirmation: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    void supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!isMounted) {
          return
        }

        setSession(data.session ?? null)
        setLoading(false)
      })
      .catch(() => {
        if (!isMounted) {
          return
        }

        setSession(null)
        setLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          throw error
        }
      },
      signUp: async (email, password, name) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: name ? { name } : undefined,
          },
        })

        if (error) {
          throw error
        }

        return {
          requiresEmailConfirmation: !data.session,
        }
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
          throw error
        }
      },
    }),
    [loading, session],
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
