import type { CookieOptionsWithName } from "@supabase/ssr"
import type { NextRequest } from "next/server"
import {
  baseSupabaseAuthCookieAttributes,
  getPublicAuthStorageKey,
  getSupabaseAuthStorageKey,
  isSupabaseAuthSessionCookieName,
  resolvedSupabaseAuthStorageKey,
} from "@/lib/supabase/auth-cookie-contract"

export {
  getPublicAuthStorageKey,
  getSupabaseAuthStorageKey,
  isSupabaseAuthSessionCookieName,
  resolvedSupabaseAuthStorageKey,
} from "@/lib/supabase/auth-cookie-contract"

/** Cookie ヘッダー文字列から名前だけ抽出（Edge でも使う・cookie パッケージ不要） */
export function parseCookieNamesFromHeader(
  cookieHeader: string | null
): string[] {
  if (!cookieHeader?.trim()) return []
  return cookieHeader
    .split(";")
    .map((p) => p.trim().split("=")[0])
    .filter((n): n is string => Boolean(n))
}

/**
 * `cookieOptions.name` → @supabase/ssr が auth.storageKey として使う（Cookie 名の基底が固定される）。
 * @see https://github.com/supabase/ssr/blob/main/src/createBrowserClient.ts
 */

function serverCookieSecure(): boolean {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production"
}

/**
 * localhost / *.local 以外は Secure=true（Vercel 本番・プレビュー・カスタムドメインで送信漏れを防ぐ）
 */
function browserCookieSecure(): boolean {
  if (typeof window !== "undefined") {
    const h = window.location.hostname
    if (
      h === "localhost" ||
      h === "127.0.0.1" ||
      h === "[::1]" ||
      h.endsWith(".local")
    ) {
      return window.location.protocol === "https:"
    }
    return true
  }
  return process.env.NODE_ENV === "production"
}

/** Middleware / Route Handler / Server Components — domain は常に未指定（Host-only） */
export function supabaseAuthCookieOptionsForServer(
  _supabaseUrl: string
): CookieOptionsWithName {
  return {
    name: getPublicAuthStorageKey(),
    ...baseSupabaseAuthCookieAttributes(serverCookieSecure()),
  }
}

/** createBrowserClient — `baseSupabaseAuthCookieAttributes` で path: "/" を含む */
export function supabaseAuthCookieOptionsForBrowser(
  _supabaseUrl: string
): CookieOptionsWithName {
  return {
    name: getPublicAuthStorageKey(),
    ...baseSupabaseAuthCookieAttributes(browserCookieSecure()),
  }
}

/**
 * sb 認証セッション Cookie が無いときの推測ログ用（ミドルウェアから呼ぶ）
 */
export function buildCookieAbsenceDiagnostics(
  request: NextRequest,
  supabaseUrl: string
): Record<string, unknown> {
  const raw = request.headers.get("cookie")
  const fromHeader = parseCookieNamesFromHeader(raw)
  const fromGetAll = request.cookies.getAll().map((c) => c.name)
  const host = request.headers.get("host")
  const xfProto = request.headers.get("x-forwarded-proto")
  const xfHost = request.headers.get("x-forwarded-host")
  const authStorageKey = resolvedSupabaseAuthStorageKey(supabaseUrl)
  const serverCookieOpts = supabaseAuthCookieOptionsForServer(supabaseUrl)

  const headerMatchesKey = fromHeader.some((n) =>
    isSupabaseAuthSessionCookieName(n, authStorageKey)
  )
  const getAllMatchesKey = fromGetAll.some((n) =>
    isSupabaseAuthSessionCookieName(n, authStorageKey)
  )

  const hypotheses: string[] = []

  if (!raw?.trim()) {
    hypotheses.push(
      "Cookie ヘッダーが空: 初回訪問・トラッキング防止で Cookie 拒否・ログイン前・またはクライアントがまだセッション Cookie を document に書いていない"
    )
  } else if (!headerMatchesKey) {
    hypotheses.push(
      "ヘッダーにセッション用 Cookie が無い: 未ログイン、または保存時のキーがサーバーの NEXT_PUBLIC_SUPABASE_URL から導出した authStorageKey と不一致（別プロジェクト URL・環境変数の食い違い）"
    )
  }

  if (raw?.trim() && headerMatchesKey && !getAllMatchesKey) {
    hypotheses.push(
      "Cookie ヘッダーにはキーがあるが NextRequest.cookies と不一致: プロキシやフレームワーク側の異常を疑う"
    )
  }

  if (
    xfHost &&
    host &&
    xfHost.split(":")[0] !== host.split(":")[0]
  ) {
    hypotheses.push(
      `Host (${host}) と x-forwarded-host (${xfHost}) が異なる: Cookie は Host に紐づくため、公開 URL とアクセス URL の取り違えで送られないことがある`
    )
  }

  if (xfProto === "http" && process.env.VERCEL === "1") {
    hypotheses.push(
      "x-forwarded-proto が http: Secure Cookie がブラウザから送られない可能性（通常 Vercel は https）"
    )
  }

  hypotheses.push(
    "domain を cookieOptions で指定していない（Host-only）。意図的。カスタム domain を無理に .vercel.app にするとカスタムドメイン利用時に Cookie が付かない"
  )

  hypotheses.push(
    "httpOnly: false は @supabase/ssr 既定どおり（ブラウザが document.cookie でセッションを書くため）。HttpOnly 必須ならサーバー Route で sign-in し Set-Cookie する方式が必要"
  )

  return {
    host,
    xForwardedHost: xfHost,
    xForwardedProto: xfProto,
    cookieHeaderByteLength: raw?.length ?? 0,
    namesFromCookieHeader: fromHeader,
    namesFromRequestCookiesGetAll: fromGetAll,
    headerVsGetAllCountMismatch: fromHeader.length !== fromGetAll.length,
    /** resolved（環境変数オーバーライド可）storageKey / Cookie 基底名 */
    authStorageKey,
    /** 後方互換の別名（ログ検索用） */
    expectedAuthCookieBaseName: authStorageKey,
    headerHasSessionCookieForKey: headerMatchesKey,
    getAllHasSessionCookieForKey: getAllMatchesKey,
    cookieOptionsUnifiedWithServer: {
      path: serverCookieOpts.path,
      sameSite: serverCookieOpts.sameSite,
      secure: serverCookieOpts.secure,
      httpOnly: serverCookieOpts.httpOnly,
      domain: "(omit = host-only)",
    },
    hypotheses,
  }
}
