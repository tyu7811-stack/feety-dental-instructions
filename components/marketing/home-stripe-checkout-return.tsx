"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const STORAGE_KEY = "v0.billing.currentPlan"

/**
 * Stripe Checkout の success_url が `/` のとき、`session_id` を検証してプラン表示用 LS を更新する。
 */
export function HomeStripeCheckoutReturn() {
  const router = useRouter()
  const [note, setNote] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id")
    if (!sessionId) return

    let cancelled = false
    ;(async () => {
      const res = await fetch(
        `/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`
      )
      const data = (await res.json()) as { planId?: string; error?: string }

      if (cancelled) return

      const u = new URL(window.location.href)
      u.searchParams.delete("session_id")
      window.history.replaceState({}, "", u.pathname + (u.search ? u.search : ""))

      if (!res.ok) {
        setNote(
          res.status === 401
            ? "決済の確認にはログインが必要です。ログイン後、請求ページからお試しください。"
            : (data.error ?? "決済の確認に失敗しました")
        )
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

  if (!note) return null

  return (
    <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
      <div
        className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        role="alert"
      >
        <p>{note}</p>
        <p className="mt-2">
          <Link href="/login" className="font-medium text-[#1a6cf0] underline-offset-2 hover:underline">
            ログイン
          </Link>
          {" · "}
          <Link href="/lab/billing" className="font-medium text-[#1a6cf0] underline-offset-2 hover:underline">
            プラン・お支払い
          </Link>
        </p>
      </div>
    </div>
  )
}
