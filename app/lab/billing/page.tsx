"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { Check, CreditCard, Crown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type Plan = "free" | "lite" | "standard" | "professional"

export default function BillingPage() {
  const STORAGE_KEY = "v0.billing.currentPlan"

  const [currentPlan, setCurrentPlan] = useState<Plan>("free")
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  useEffect(() => {
    const savedPlan = window.localStorage.getItem(STORAGE_KEY)
    // 旧キー互換：premium を標準（standard）にマッピング
    if (savedPlan === "free") setCurrentPlan("free")
    else if (savedPlan === "lite") setCurrentPlan("lite")
    else if (savedPlan === "premium" || savedPlan === "standard") setCurrentPlan("standard")
    else if (savedPlan === "professional") setCurrentPlan("professional")
  }, [])

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get("canceled") === "1") {
      setCheckoutError("Checkout をキャンセルしました")
    }
  }, [])

  function handleSelectPlan(nextPlan: Plan) {
    setCurrentPlan(nextPlan)
    window.localStorage.setItem(STORAGE_KEY, nextPlan)
  }

  async function startStripeCheckout(nextPlan: Exclude<Plan, "free">) {
    setCheckoutError(null)
    setCheckoutPlan(nextPlan)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: nextPlan }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok) {
        setCheckoutError(data.error ?? "Checkout を開始できませんでした")
        return
      }
      if (data.url) {
        window.location.href = data.url
        return
      }
      setCheckoutError("Checkout URL を取得できませんでした")
    } catch {
      setCheckoutError("通信エラーが発生しました")
    } finally {
      setCheckoutPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            プラン・お支払い
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500">
            技工所様向けプランです。フリーはお試し利用（案件・医院数に上限あり）。有料は税別月額で、Stripe Checkout より決済します。
          </p>
          {checkoutError && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {checkoutError}
            </p>
          )}
        </div>

        {/* Current Plan Status */}
        <div className="mb-6 rounded-xl border border-sky-200 bg-sky-50/80 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100">
                <Sparkles className="h-5 w-5 text-sky-700" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-sky-800/80">現在のプラン</p>
                <p className="text-sm sm:text-base font-bold text-sky-900 truncate">
                  {currentPlan === "free"
                    ? "フリー（お試し利用）"
                    : currentPlan === "lite"
                      ? "ライト"
                      : currentPlan === "standard"
                        ? "スタンダード"
                        : "プロ"}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-sky-800/70">
              <CreditCard className="h-4 w-4" />
              <span>有料は Stripe</span>
            </div>
          </div>
        </div>

        {/* Plan Cards (3カラム統合) */}
        <section className="rounded-2xl border border-border/70 bg-white/70 p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                プラン比較
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                金額はサーバー側カタログで確定します（フロントの表示のみでは変えられません）。
              </p>
            </div>
            <div className="hidden lg:block text-right text-xs text-gray-500">
              <div className="font-semibold text-gray-700">無料＝即時反映</div>
              <div>有料＝Checkout へ遷移</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Free */}
            <PlanCard
              planId="free"
              title="フリー"
              priceLabel="¥0 / 月額"
              description="お試し利用"
              border="border-emerald-200"
              currentPlan={currentPlan}
              onSelect={handleSelectPlan}
              badge={null}
              icon={<Sparkles className="h-5 w-5 text-emerald-600" />}
              features={[
                "案件管理（5件／月まで）",
                "技工指示書の受信",
                "納品書作成",
                "提携医院（3件まで）",
              ]}
            />

            {/* Lite */}
            <PlanCard
              planId="lite"
              title="ライト"
              priceLabel="¥3,980 / 月（税別）"
              description="小規模技工所向け"
              border="border-slate-200"
              currentPlan={currentPlan}
              onSelect={handleSelectPlan}
              checkoutLoading={checkoutPlan === "lite"}
              onCheckout={startStripeCheckout}
              badge={null}
              icon={<Sparkles className="h-5 w-5 text-slate-600" />}
              features={[
                "案件管理（30件／月まで）",
                "技工指示書の受信",
                "納品書作成",
                "提携医院（10件まで）",
                "メールサポート",
              ]}
            />

            {/* Standard */}
            <PlanCard
              planId="standard"
              title="スタンダード"
              priceLabel="¥9,800 / 月（税別）"
              description="中規模技工所向け"
              border="border-primary/20"
              currentPlan={currentPlan}
              onSelect={handleSelectPlan}
              checkoutLoading={checkoutPlan === "standard"}
              onCheckout={startStripeCheckout}
              badge="人気"
              icon={<Crown className="h-5 w-5 text-primary-foreground" />}
              features={[
                "案件管理（100件／月まで）",
                "技工指示書の受信",
                "納品書作成",
                "提携医院（30件まで）",
                "売上分析レポート",
                "優先サポート",
              ]}
            />

            {/* Professional */}
            <PlanCard
              planId="professional"
              title="プロ"
              priceLabel="¥19,800 / 月（税別）"
              description="大規模技工所向け"
              border="border-amber-200"
              currentPlan={currentPlan}
              onSelect={handleSelectPlan}
              checkoutLoading={checkoutPlan === "professional"}
              onCheckout={startStripeCheckout}
              badge={null}
              icon={<Crown className="h-5 w-5 text-amber-600" />}
              features={[
                "案件管理（無制限）",
                "技工指示書の受信",
                "納品書作成",
                "提携医院（無制限）",
                "高度な分析機能",
                "専任サポート",
                "カスタム機能相談",
              ]}
            />
          </div>

          <div className="mt-5 text-xs text-gray-500">
            参考：
            <Link href="/legal/terms" className="text-primary hover:underline">利用規約</Link>
            {" / "}
            <Link href="/legal/privacy" className="text-primary hover:underline">プライバシーポリシー</Link>
            {" / "}
            <Link href="/legal/tokushoho" className="text-primary hover:underline">特定商取引法に基づく表記</Link>
          </div>
        </section>

        {/* Footer with legal links */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            <Link href="/legal/terms" className="hover:text-gray-600 transition-colors">
              利用規約
            </Link>
            <span>|</span>
            <Link href="/legal/privacy" className="hover:text-gray-600 transition-colors">
              プライバシーポリシー
            </Link>
            <span>|</span>
            <Link href="/legal/tokushoho" className="hover:text-gray-600 transition-colors">
              特定商取引法に基づく表記
            </Link>
            <span>|</span>
            <span>© 2026 ナチュラルアート</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlanCard({
  planId,
  title,
  priceLabel,
  description,
  border,
  currentPlan,
  onSelect,
  onCheckout,
  checkoutLoading = false,
  badge,
  icon,
  features,
}: {
  planId: "free" | "lite" | "standard" | "professional"
  title: string
  priceLabel: string
  description: string
  border: string
  currentPlan: Plan
  onSelect: (plan: Plan) => void
  onCheckout?: (plan: Exclude<Plan, "free">) => void
  checkoutLoading?: boolean
  badge: string | null
  icon: ReactNode
  features: string[]
}) {
  const isCurrent = currentPlan === planId
  const isPaid = planId !== "free"

  const buttonLabel = checkoutLoading
    ? "処理中…"
    : isCurrent
      ? "現在のプラン"
      : isPaid
        ? "選択する（Stripe）"
        : "このプランにする"

  function handlePrimaryClick() {
    if (isCurrent || checkoutLoading) return
    if (planId !== "free" && onCheckout) {
      onCheckout(planId)
      return
    }
    onSelect(planId)
  }

  return (
    <div
      className={[
        "relative rounded-xl border bg-white p-4 shadow-sm transition",
        border,
        isCurrent ? "ring-2 ring-primary ring-offset-2" : "hover:shadow-md",
      ].join(" ")}
    >
      {badge && (
        <div
          className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[11px] font-bold text-white",
            badge === "人気" ? "bg-foreground" : "bg-primary"
          )}
        >
          {badge}
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center rounded-lg bg-slate-100 p-1.5">
              {icon}
            </span>
            <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          </div>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>

      <div className="flex items-end gap-2 mb-3">
        <div className="text-xl font-extrabold text-gray-900">{priceLabel}</div>
      </div>

      <ul className="space-y-1.5 mb-3">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-gray-700">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-2.5 w-2.5 text-emerald-600" />
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={handlePrimaryClick}
        disabled={isCurrent || checkoutLoading}
        className={[
          "w-full rounded-lg py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-2",
          isCurrent || checkoutLoading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : `bg-blue-600 hover:bg-blue-700 text-white`,
          isCurrent && !checkoutLoading ? "disabled:opacity-100" : "",
        ].join(" ")}
      >
        <CreditCard className="h-3.5 w-3.5" />
        {buttonLabel}
      </button>
    </div>
  )
}
