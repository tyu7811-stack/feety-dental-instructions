"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const STORAGE_KEY = "v0.billing.currentPlan"

export default function BillingSuccessPage() {
  const router = useRouter()
  const [message, setMessage] = useState("決済を確認しています…")

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id")
    if (!sessionId) {
      setMessage("セッションが見つかりません")
      return
    }

    let cancelled = false
    ;(async () => {
      const res = await fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`)
      const data = (await res.json()) as { planId?: string; error?: string }

      if (cancelled) return

      if (!res.ok) {
        setMessage(data.error ?? "確認に失敗しました")
        return
      }

      if (data.planId) {
        window.localStorage.setItem(STORAGE_KEY, data.planId)
      }
      router.replace("/")
    })()

    return () => {
      cancelled = true
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-gradient-to-b from-slate-50 to-white">
      <p className="text-sm text-gray-700">{message}</p>
      <Link href="/" className="text-sm text-primary hover:underline">
        トップへ
      </Link>
    </div>
  )
}
