import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { User } from "@supabase/supabase-js"
import { getSupabaseEnv, logSupabaseUrlIfDevServer } from "@/lib/supabase"

/**
 * getUser() でセッション更新した際に付く Set-Cookie を、
 * NextResponse.redirect() など別インスタンスへ引き継がないと、
 * 次リクエストで未ログイン扱いになり /login ↔ /lab でループする。
 */
function copyCookiesFromResponse(
  source: NextResponse,
  target: NextResponse
): NextResponse {
  for (const c of source.cookies.getAll()) {
    target.cookies.set(c)
  }
  return target
}

function redirectPreservingAuthCookies(
  request: NextRequest,
  supabaseResponse: NextResponse,
  pathname: string,
  search?: string
): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  if (search !== undefined) url.search = search
  const redirect = NextResponse.redirect(url)
  return copyCookiesFromResponse(supabaseResponse, redirect)
}

function postLoginPathForUser(user: User): string {
  const role =
    (user.user_metadata?.role as string | undefined) ??
    (user.user_metadata?.user_type as string | undefined) ??
    (user.app_metadata?.role as string | undefined)
  if (role === "admin") return "/admin"
  if (role === "clinic") return "/clinic/dashboard"
  return "/lab/dashboard"
}

export async function updateSession(request: NextRequest) {
  logSupabaseUrlIfDevServer()
  const { url, anonKey } = getSupabaseEnv()

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set({
            name,
            value,
            ...options,
          })
        })
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options)
        })
      },
    },
  })

  let user: User | null = null
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error && process.env.NODE_ENV === "development") {
      console.warn("[middleware] auth.getUser:", error.message)
    }
    user = data.user ?? null
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[middleware] auth.getUser threw:", e)
    }
  }

  const pathname = request.nextUrl.pathname

  const publicPrefixes = [
    "/login",
    "/debug-test-entry",
    "/signup",
    "/signup2",
    "/admin-auth",
    "/legal",
    "/plans",
    "/request-document",
    "/auth/callback",
  ]
  const isPublicPage =
    pathname === "/" ||
    publicPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  if (user && (pathname === "/login" || pathname === "/auth/login")) {
    const dest = postLoginPathForUser(user)
    return redirectPreservingAuthCookies(request, supabaseResponse, dest)
  }

  if (isPublicPage) {
    return supabaseResponse
  }

  const protectedPaths = ["/lab", "/clinic", "/admin", "/account"]
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  const demoQuery = request.nextUrl.searchParams.get("demo") === "true"
  const isClinicNewOrderDemo =
    pathname === "/clinic/orders/new" && demoQuery
  const isLabDemoPublic = demoQuery && pathname === "/lab/dashboard"
  const allowDevPreview = process.env.NODE_ENV !== "production"
  const isDemoMode =
    isClinicNewOrderDemo ||
    isLabDemoPublic ||
    (allowDevPreview && demoQuery)
  const isTestMode =
    allowDevPreview && request.nextUrl.searchParams.get("test") === "true"

  if (isProtectedPath && !user && !isDemoMode && !isTestMode) {
    if (process.env.NODE_ENV === "development") {
      const names = request.cookies.getAll().map((c) => c.name)
      console.warn("[middleware] protected route without session", {
        pathname,
        cookieNames: names,
      })
    }
    return redirectPreservingAuthCookies(
      request,
      supabaseResponse,
      "/login"
    )
  }

  if (pathname === "/auth/login") {
    return redirectPreservingAuthCookies(request, supabaseResponse, "/login")
  }

  return supabaseResponse
}
