import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { getSupabaseEnv, logSupabaseUrlIfDevServer } from "@/lib/supabase"

export async function updateSession(request: NextRequest) {
  logSupabaseUrlIfDevServer()
  const { url, anonKey } = getSupabaseEnv()

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 認証不要ページ（ホワイトリスト）。先頭が "/" だけのルールは全パスにマッチするため別扱い。
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

  // ログイン済みはログイン画面からアプリへ（公開ページより先に判定）
  if (user && (pathname === "/login" || pathname === "/auth/login")) {
    const redirectUrl = request.nextUrl.clone()
    const userType =
      user.user_metadata?.user_type || user.user_metadata?.role
    if (userType === "lab") {
      redirectUrl.pathname = "/lab/dashboard"
    } else if (userType === "clinic") {
      redirectUrl.pathname = "/clinic/dashboard"
    } else {
      redirectUrl.pathname = "/lab/dashboard"
    }
    return NextResponse.redirect(redirectUrl)
  }

  // 認証不要ページへのアクセスはそのまま許可
  if (isPublicPage) {
    return supabaseResponse
  }

  // 保護されたルートへのアクセス制御
  const protectedPaths = ["/lab", "/clinic", "/admin", "/account"]
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  )

  // デモ: ログイン画面の「技工指示書（デモ）」は本番でも /clinic/orders/new?demo=true のみ未ログイン可
  const demoQuery = request.nextUrl.searchParams.get("demo") === "true"
  const isClinicNewOrderDemo =
    pathname === "/clinic/orders/new" && demoQuery
  const allowDevPreview = process.env.NODE_ENV !== "production"
  const isDemoMode =
    isClinicNewOrderDemo || (allowDevPreview && demoQuery)
  const isTestMode =
    allowDevPreview && request.nextUrl.searchParams.get("test") === "true"

  // 保護ページへのアクセス制御
  if (isProtectedPath && !user && !isDemoMode && !isTestMode) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // 旧パス /auth/login は /login へ
  if (pathname === "/auth/login") {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
