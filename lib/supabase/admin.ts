import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let admin: SupabaseClient | null | undefined

/** Webhook 等サーバーのみ。キー未設定時は null（ログのみ運用可） */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (admin !== undefined) return admin

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url || !key) {
    admin = null
    return admin
  }

  admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return admin
}
