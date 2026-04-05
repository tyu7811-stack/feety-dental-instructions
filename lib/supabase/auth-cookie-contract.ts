import type { CookieOptionsWithName } from "@supabase/ssr"

/**
 * supabase-js の SupabaseClient と同一の既定ストレージキー。
 * @see packages/core/supabase-js/src/SupabaseClient.ts — defaultStorageKey = `sb-${baseUrl.hostname.split('.')[0]}-auth-token`
 *
 * カスタム Supabase URL（独自ドメイン）でも先頭ラベルが使われるため、*.supabase.co 限定にしない。
 */
export function getSupabaseAuthStorageKey(supabaseUrl: string): string {
  const trimmed = supabaseUrl.trim()
  const href =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`
  const hostname = new URL(href).hostname
  const firstLabel = hostname.split(".")[0] || "localhost"
  return `sb-${firstLabel}-auth-token`
}

/** 環境変数未設定時の既定（Feety プロジェクト用） */
export const DEFAULT_SUPABASE_AUTH_STORAGE_KEY = "sb-feety-auth-token"

/**
 * Vercel の `NEXT_PUBLIC_SUPABASE_AUTH_STORAGE_KEY` とコード側の既定を一致させる。
 * Cookie の `name`（storageKey）と `auth.storageKey` の両方で使う。
 */
export function getPublicAuthStorageKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_AUTH_STORAGE_KEY ||
    DEFAULT_SUPABASE_AUTH_STORAGE_KEY
  )
}

/** createServerClient / createBrowserClient 共通の auth オプション（Vercel 環境変数と同期） */
export function getSupabaseCreateClientAuthOptions() {
  return {
    storageKey:
      process.env.NEXT_PUBLIC_SUPABASE_AUTH_STORAGE_KEY ||
      DEFAULT_SUPABASE_AUTH_STORAGE_KEY,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
}

/**
 * @deprecated 互換のため残す。常に `getPublicAuthStorageKey()` と同じ。
 */
export function resolvedSupabaseAuthStorageKey(_supabaseUrl: string): string {
  return getPublicAuthStorageKey()
}

/**
 * セッション用 Cookie 名か（本体 + chunk `.0` `.1` … のみ）。
 * `…-code-verifier` は含めない。
 */
export function isSupabaseAuthSessionCookieName(
  cookieName: string,
  storageKey: string
): boolean {
  if (cookieName === storageKey) return true
  if (!cookieName.startsWith(`${storageKey}.`)) return false
  const rest = cookieName.slice(storageKey.length + 1)
  return /^\d+$/.test(rest)
}

/**
 * @supabase/ssr の DEFAULT_COOKIE_OPTIONS に合わせた共通属性（domain は付けない = Host-only）。
 * httpOnly: true は document.cookie では設定不能のため、ブラウザ側 signIn では使わない（公式も false）。
 */
export function baseSupabaseAuthCookieAttributes(secure: boolean): Omit<
  CookieOptionsWithName,
  "name"
> {
  return {
    path: "/",
    sameSite: "lax",
    secure,
    httpOnly: false,
  }
}
