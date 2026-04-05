import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseEnv } from "@/lib/supabase"
import { getSupabaseCreateClientAuthOptions } from "@/lib/supabase/auth-cookie-contract"
import { supabaseAuthCookieOptionsForBrowser } from "@/lib/supabase/cookie-options"

export function createClient() {
  const { url, anonKey } = getSupabaseEnv()
  return createBrowserClient(url, anonKey, {
    auth: getSupabaseCreateClientAuthOptions(),
    cookieOptions: supabaseAuthCookieOptionsForBrowser(url),
  })
}
