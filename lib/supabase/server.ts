import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getSupabaseEnv, logSupabaseUrlIfDevServer } from "@/lib/supabase"

export async function createClient() {
  logSupabaseUrlIfDevServer()
  const { url, anonKey } = getSupabaseEnv()
  const cookieStore = await cookies()

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The "setAll" method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  )
}
