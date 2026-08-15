import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const ADMIN_EMAIL = 'abdobody19102006@gmail.com'
export const HUB_FILES_BUCKET = 'hub-files'

export interface HubFile {
  id: string
  kind: 'guide' | 'demo'
  file_name: string
  storage_path: string
  mime_type: string
  size_bytes: number
  updated_by: string | null
  updated_at: string
}

export function isAdminEmail(email: string | undefined | null): boolean {
  return !!email && email.toLowerCase() === ADMIN_EMAIL
}
