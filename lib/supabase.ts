let devUrlLogged = false

export function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ""
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? ""
  if (!url || !anonKey) {
    throw new Error(
      "Supabase: NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を環境変数に設定してください（.env.local または Vercel の Environment Variables）"
    )
  }
  return { url, anonKey }
}

/** 開発・サーバーのみ、1 回だけ URL 先頭をログ */
export function logSupabaseUrlIfDevServer(): void {
  if (process.env.NODE_ENV !== "development") return
  if (typeof window !== "undefined") return
  if (devUrlLogged) return
  devUrlLogged = true
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL
  console.log(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL:",
    raw ? `${raw.slice(0, 40)}…` : "(undefined)"
  )
}
