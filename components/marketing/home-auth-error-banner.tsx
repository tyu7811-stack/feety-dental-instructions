"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

/**
 * /signup2 から / へ寄せたあと、auth/callback 等の ?error= をトップで表示する。
 */
export function HomeAuthErrorBanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const q = searchParams.get("error")
    if (!q) return
    if (q === "auth_callback") {
      setMessage("メール認証リンクが無効か期限切れです。もう一度お試しください。")
    } else if (q === "no_user") {
      setMessage("ユーザー情報を取得できませんでした。もう一度お試しください。")
    } else {
      setMessage(decodeURIComponent(q))
    }
    router.replace("/", { scroll: false })
  }, [searchParams, router])

  if (!message) return null

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
      {message}
    </div>
  )
}
