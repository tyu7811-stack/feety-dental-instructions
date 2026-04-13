import { NextResponse, type NextRequest } from "next/server"
import { getFeetyAppOrigin } from "@/lib/feety-app-origin"

/**
 * 本番アプリホスト（NEXT_PUBLIC_FEETY_APP_ORIGIN の hostname）では
 * `/signup2` を `/` に寄せる（クエリは維持）。
 * ローカル等・別ホストでは登録画面をそのまま出す。
 */
export function redirectSignup2ToRoot(request: NextRequest): NextResponse | null {
  if (request.nextUrl.pathname !== "/signup2") return null
  if (request.method !== "GET" && request.method !== "HEAD") return null

  const reqHost = request.headers.get("host")?.split(":")[0].toLowerCase() ?? ""
  let appHost: string
  try {
    appHost = new URL(getFeetyAppOrigin()).hostname.toLowerCase()
  } catch {
    return null
  }
  if (reqHost !== appHost) return null

  const dest = new URL("/", getFeetyAppOrigin())
  dest.search = request.nextUrl.searchParams.toString()
  return NextResponse.redirect(dest, 308)
}
