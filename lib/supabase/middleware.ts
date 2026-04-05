import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { User } from "@supabase/supabase-js"
import { getSupabaseEnv, logSupabaseUrlIfDevServer } from "@/lib/supabase"
import {
  getPublicAuthStorageKey,
  getSupabaseCreateClientAuthOptions,
} from "@/lib/supabase/auth-cookie-contract"
import {
  buildCookieAbsenceDiagnostics,
  isSupabaseAuthSessionCookieName,
  parseCookieNamesFromHeader,
  supabaseAuthCookieOptionsForServer,
} from "@/lib/supabase/cookie-options"

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
  search: string | undefined,
  logReason: string,
  logDetails: Record<string, unknown>,
  authStorageKey: string
): NextResponse {
  const cookieNames = request.cookies.getAll().map((c) => c.name)
  const hasSbCookie = cookieNames.some((n) =>
    isSupabaseAuthSessionCookieName(n, authStorageKey)
  )
  console.log("[middleware][REDIRECT]", {
    reason: logReason,
    toPath: pathname,
    toSearch: search ?? "(unchanged)",
    fromPath: request.nextUrl.pathname,
    fromSearch: request.nextUrl.search || "(none)",
    cookieCount: cookieNames.length,
    cookieNames,
    hasSbAuthNamedCookie: hasSbCookie,
    ...logDetails,
  })

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
  const authStorageKey = getPublicAuthStorageKey()
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

  // @supabase/ssr + Next.js App Router: 公式どおり request に name/value のみ、
  // response 側で options を付与。オブジェクト1引数の request.cookies.set は Edge で期待どおり動かないことがある。
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(url, anonKey, {
    auth: getSupabaseCreateClientAuthOptions(),
    cookieOptions: supabaseAuthCookieOptionsForServer(url),
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
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

  const rawCookieHeader = request.headers.get("cookie")
  const namesParsedFromHeader = parseCookieNamesFromHeader(rawCookieHeader)
  const incomingCookies = request.cookies.getAll()
  const sbAuthCookies = incomingCookies.filter((c) =>
    isSupabaseAuthSessionCookieName(c.name, authStorageKey)
  )
  const headerHasSessionCookie = namesParsedFromHeader.some((n) =>
    isSupabaseAuthSessionCookieName(n, authStorageKey)
  )
  console.log("[middleware][cookies:before-getUser]", {
    path: pathname,
    authStorageKey,
    cookieCount: incomingCookies.length,
    cookieNames: incomingCookies.map((c) => c.name),
    sbAuthCookieCount: sbAuthCookies.length,
    sbAuthCookieValueLengths: sbAuthCookies.map((c) => c.value?.length ?? 0),
    cookieHeaderByteLength: rawCookieHeader?.length ?? 0,
    namesParsedFromCookieHeader: namesParsedFromHeader,
    headerNameCountVsGetAll:
      namesParsedFromHeader.length !== incomingCookies.length,
    headerHasSessionCookieForAuthStorageKey: headerHasSessionCookie,
  })

  if (sbAuthCookies.length === 0 && !isPublicPage) {
    console.log(
      "[middleware][cookies:diagnostics]",
      buildCookieAbsenceDiagnostics(request, url)
    )
  }

  let user: User | null = null
  let getUserErrorMessage: string | null = null
  let getUserThrown: string | null = null
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      getUserErrorMessage = error.message
      console.warn("[middleware] auth.getUser error:", error.message)
    }
    user = data.user ?? null
  } catch (e) {
    getUserThrown = e instanceof Error ? e.message : String(e)
    console.warn("[middleware] auth.getUser threw:", getUserThrown)
  }

  if (user && (pathname === "/login" || pathname === "/auth/login")) {
    const dest = postLoginPathForUser(user)
    return redirectPreservingAuthCookies(
      request,
      supabaseResponse,
      dest,
      undefined,
      "LOGGED_IN_USER_ON_LOGIN_PAGE",
      {
        userId: user.id,
        redirectTarget: dest,
        roleFromJwt:
          user.user_metadata?.role ??
          user.user_metadata?.user_type ??
          user.app_metadata?.role ??
          "(none in jwt metadata)",
      },
      authStorageKey
    )
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
    return redirectPreservingAuthCookies(
      request,
      supabaseResponse,
      "/login",
      undefined,
      "PROTECTED_ROUTE_BUT_NO_USER",
      {
        isProtectedPath,
        isDemoMode,
        isTestMode,
        demoQuery,
        isClinicNewOrderDemo,
        isLabDemoPublic,
        getUserErrorMessage,
        getUserThrown,
        note: "ミドルウェアの getUser() が user=null。Cookie 未送信・期限切れ・JWT検証失敗のいずれかの可能性。",
      },
      authStorageKey
    )
  }

  if (pathname === "/auth/login") {
    return redirectPreservingAuthCookies(
      request,
      supabaseResponse,
      "/login",
      undefined,
      "LEGACY_PATH_AUTH_LOGIN_TO_LOGIN",
      {},
      authStorageKey
    )
  }

  return supabaseResponse
}
