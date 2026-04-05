import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getSupabaseEnv, logSupabaseUrlIfDevServer } from "@/lib/supabase"
import { getSupabaseCreateClientAuthOptions } from "@/lib/supabase/auth-cookie-contract"
import { supabaseAuthCookieOptionsForServer } from "@/lib/supabase/cookie-options"

/** Cookie 属性・storageKey は middleware / auth callback と同一（`cookie-options.ts`） */

export async function createClient() {
  logSupabaseUrlIfDevServer()
  const { url, anonKey } = getSupabaseEnv()
  const cookieStore = await cookies()

  return createServerClient(
    url,
    anonKey,
    {
      auth: getSupabaseCreateClientAuthOptions(),
      cookieOptions: supabaseAuthCookieOptionsForServer(url),
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (e) {
            // Server Component など set が禁止なコンテキストでは無視（セッション更新は middleware が担当）
            if (process.env.NODE_ENV === "development") {
              console.warn("[supabase/server] setAll skipped:", e)
            }
          }
        },
      },
    }
  )
}
