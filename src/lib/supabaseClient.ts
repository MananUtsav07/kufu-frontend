import { createClient } from '@supabase/supabase-js'

const fallbackSupabaseUrl = 'https://placeholder.supabase.co'
const fallbackSupabaseAnonKey = 'placeholder-anon-key'

const supabaseUrl =
  typeof import.meta.env.VITE_SUPABASE_URL === 'string' &&
  import.meta.env.VITE_SUPABASE_URL.trim().length > 0
    ? import.meta.env.VITE_SUPABASE_URL.trim()
    : fallbackSupabaseUrl

const supabaseAnonKey =
  typeof import.meta.env.VITE_SUPABASE_ANON_KEY === 'string' &&
  import.meta.env.VITE_SUPABASE_ANON_KEY.trim().length > 0
    ? import.meta.env.VITE_SUPABASE_ANON_KEY.trim()
    : fallbackSupabaseAnonKey

if (supabaseUrl === fallbackSupabaseUrl || supabaseAnonKey === fallbackSupabaseAnonKey) {
  // Keep app bootable in local/dev if env values are missing.
  console.warn(
    'Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
