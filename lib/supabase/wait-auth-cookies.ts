import {
  isSupabaseAuthSessionCookieName,
  resolvedSupabaseAuthStorageKey,
} from "@/lib/supabase/auth-cookie-contract"

/**
 * ログイン直後: document.cookie に Supabase セッション Cookie が現れるまで待つ（クライアント専用）
 */
export function documentCookieNames(): string[] {
  if (typeof document === "undefined") return []
  if (!document.cookie?.trim()) return []
  return document.cookie
    .split(";")
    .map((p) => p.trim().split("=")[0])
    .filter(Boolean)
}

/** supabase-js と同一の storageKey + chunk（`.0` 等）が document にあるか */
export function hasSupabaseAuthCookieInDocument(
  supabaseUrl: string
): boolean {
  const names = documentCookieNames()
  if (names.length === 0) return false
  const storageKey = resolvedSupabaseAuthStorageKey(supabaseUrl)
  return names.some((n) => isSupabaseAuthSessionCookieName(n, storageKey))
}

export async function waitUntilSupabaseAuthCookiesVisible(options: {
  supabaseUrl: string
  pollMs?: number
  maxMs?: number
}): Promise<{ ok: boolean; cookieNames: string[] }> {
  const { supabaseUrl, pollMs = 60, maxMs = 6000 } = options
  const deadline = Date.now() + maxMs

  while (Date.now() < deadline) {
    const cookieNames = documentCookieNames()
    if (hasSupabaseAuthCookieInDocument(supabaseUrl)) {
      return { ok: true, cookieNames }
    }
    await new Promise((r) => setTimeout(r, pollMs))
  }

  return { ok: false, cookieNames: documentCookieNames() }
}
