import { NextResponse, type NextRequest } from "next/server"
import { getFeetyAppOrigin } from "@/lib/feety-app-origin"

function normalizedHost(header: string | null): string {
  if (!header) return ""
  return header.split(":")[0].trim().toLowerCase()
}

const legacyHostConfigured = process.env.LEGACY_FEETY_VERCEL_HOST?.trim().toLowerCase()
const marketingOriginConfigured = process.env.MARKETING_SITE_ORIGIN?.trim().replace(/\/$/, "")

/**
 * 旧 Vercel ドメイン（例: feety-dental-instructions.vercel.app）でこのアプリが動いている場合、
 * - マーケ相当のパス → v0 等の LP（MARKETING_SITE_ORIGIN）
 * - それ以外（ログイン・登録・/lab・API 等）→ 本番アプリ（NEXT_PUBLIC_FEETY_APP_ORIGIN）
 *
 * 未設定時は何もしない。feety-dental-instructions プロジェクトにだけ環境変数を設定する想定。
 */
export function redirectIfLegacyHost(request: NextRequest): NextResponse | null {
  if (!legacyHostConfigured || !marketingOriginConfigured) return null
  if (request.method !== "GET" && request.method !== "HEAD") return null

  const host = normalizedHost(request.headers.get("host"))
  if (host !== legacyHostConfigured) return null

  const pathname = request.nextUrl.pathname
  const search = request.nextUrl.search
  const params = request.nextUrl.searchParams
  const appOrigin = getFeetyAppOrigin()

  const isMarketingOnlyPath =
    pathname === "/" ||
    pathname === "/plans" ||
    pathname === "/request-document"

  if (isMarketingOnlyPath) {
    let raw: string
    if (pathname === "/") {
      raw = `${marketingOriginConfigured}/`
    } else if (pathname === "/plans") {
      raw =
        process.env.MARKETING_PLANS_URL?.trim() ||
        `${marketingOriginConfigured}/`
    } else {
      raw =
        process.env.MARKETING_REQUEST_DOC_URL?.trim() ||
        `${marketingOriginConfigured}/`
    }

    const dest = /^https?:\/\//i.test(raw)
      ? new URL(raw)
      : new URL(raw.replace(/^\//, ""), `${marketingOriginConfigured}/`)
    if (!dest.search && params.toString()) {
      dest.search = params.toString()
    }
    return NextResponse.redirect(dest, 307)
  }

  const canonical = new URL(pathname + search, `${appOrigin}/`)
  return NextResponse.redirect(canonical, 308)
}
