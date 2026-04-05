"use client"

/**
 * 一時診断用: ブラウザコンソールに Cookie（document から見える範囲）と getSession() を出力する。
 * HttpOnly の sb-* トークンは document.cookie に出ないため「なし」でもサーバーでは存在し得る。
 * 確認後はこのコンポーネントを layout から外してください。
 */
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function SupabaseBrowserAuthDebug() {
  const pathname = usePathname()

  useEffect(() => {
    const tag = "[FEETY DEBUG][Browser Auth]"

    const raw = typeof document !== "undefined" ? document.cookie : ""
    const pairs = raw
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const i = s.indexOf("=")
        return i === -1 ? { name: s, value: "" } : { name: s.slice(0, i), value: s.slice(i + 1) }
      })

    const names = pairs.map((p) => p.name)
    const sbLike = names.filter(
      (n) =>
        n.toLowerCase().includes("sb-") &&
        (n.toLowerCase().includes("auth") || n.toLowerCase().includes("token"))
    )

    console.log(`${tag} pathname=`, pathname)
    console.log(
      `${tag} document.cookie に見える Cookie 名 (HttpOnly はここに出ません):`,
      names.length ? names : "(empty)"
    )
    console.log(
      `${tag} sb-* + auth/token を含む名前 (JS から読める場合のみ):`,
      sbLike.length ? sbLike : "(none visible — 多くの構成では HttpOnly のため正常)"
    )

    const supabase = createClient()
    void supabase.auth.getSession().then(({ data, error }) => {
      console.log(`${tag} getSession() error:`, error?.message ?? null)
      console.log(
        `${tag} Session Active:`,
        !!data.session,
        "| user.id:",
        data.session?.user?.id ?? null
      )
    })
  }, [pathname])

  return null
}
