import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getSupabaseEnv } from "@/lib/supabase"
import { getSupabaseCreateClientAuthOptions } from "@/lib/supabase/auth-cookie-contract"
import { supabaseAuthCookieOptionsForServer } from "@/lib/supabase/cookie-options"
import {
  completeSignupProvisioning,
  dashboardPathForUser,
} from "@/lib/auth/complete-signup-profile"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=auth_callback`)
  }

  const cookieStore = await cookies()
  const { url, anonKey } = getSupabaseEnv()

  const supabase = createServerClient(url, anonKey, {
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
        } catch {
          /* ignore */
        }
      },
    },
  })

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
    code
  )

  if (exchangeError) {
    return NextResponse.redirect(
      `${origin}/?error=${encodeURIComponent(exchangeError.message)}`
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/?error=no_user`)
  }

  const { error: provError } = await completeSignupProvisioning(supabase, user)

  if (provError) {
    console.error("completeSignupProvisioning:", provError)
  }

  const next = dashboardPathForUser(user)
  return NextResponse.redirect(`${origin}${next}`)
}
