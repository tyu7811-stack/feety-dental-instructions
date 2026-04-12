"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { Check, CreditCard, Crown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { getLabPlanMarketing } from "@/lib/content/lab-plans"
import type { BillingInterval } from "@/lib/stripe/catalog"

type Plan = "free" | "lite" | "standard" | "professional"

type CheckoutPending = {
  plan: Exclude<Plan, "free">
  interval: BillingInterval
}

export default function BillingPage() {
  const STORAGE_KEY = "v0.billing.currentPlan"

  const [currentPlan, setCurrentPlan] = useState<Plan>("free")
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
  const [planLoading, setPlanLoading] = useState(true)
  const [checkoutPending, setCheckoutPending] = useState<CheckoutPending | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/lab/subscription")
        const data = (await res.json()) as {
          plan?: Plan
          status?: string
          error?: string
        }
        if (cancelled) return
        if (res.ok && data.plan) {
          setCurrentPlan(data.plan)
          setSubscriptionStatus(data.status ?? null)
          window.localStorage.setItem(STORAGE_KEY, data.plan)
          return
        }
        const saved = window.localStorage.getItem(STORAGE_KEY)
        if (saved === "free") setCurrentPlan("free")
        else if (saved === "lite") setCurrentPlan("lite")
        else if (saved === "premium" || saved === "standard") setCurrentPlan("standard")
        else if (saved === "professional") setCurrentPlan("professional")
        if (data.error) {
          setCheckoutError(data.error)
        }
      } catch {
        if (!cancelled) {
          const saved = window.localStorage.getItem(STORAGE_KEY)
          if (saved === "free") setCurrentPlan("free")
          else if (saved === "lite") setCurrentPlan("lite")
          else if (saved === "premium" || saved === "standard") setCurrentPlan("standard")
          else if (saved === "professional") setCurrentPlan("professional")
        }
      } finally {
        if (!cancelled) setPlanLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get("canceled") === "1") {
      setCheckoutError("Checkout をキャンセルしました")
    }
  }, [])

  const displayPlanForCards: Plan | null = planLoading ? null : currentPlan

  function handleSelectPlan(nextPlan: Plan) {
    if (nextPlan === "free" && currentPlan !== "free") {
      setCheckoutError(
        "有料プランの解約・ダウングレードは Stripe のお客様ポータルまたは窓口までお問い合わせください。"
      )
      return
    }
    setCheckoutError(null)
    setCurrentPlan(nextPlan)
    window.localStorage.setItem(STORAGE_KEY, nextPlan)
  }

  async function startStripeCheckout(
    nextPlan: Exclude<Plan, "free">,
    interval: BillingInterval
  ) {
    setCheckoutError(null)
    setCheckoutPending({ plan: nextPlan, interval })
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: nextPlan, billingInterval: interval }),
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
      setCheckoutPending(null)
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
            技工所様向けプランです。フリーはお試し利用（案件・医院数に上限あり）。有料はすべて税込表示です。月払いまたは年払い（月額の10回分・2か月分相当お得）を Stripe
            Checkout でお選びいただけます。お支払い完了後は Webhook により Supabase の契約情報が更新され、本ページの「現在のプラン」に反映されます。
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
                  {planLoading
                    ? "取得中…"
                    : currentPlan === "free"
                      ? "フリー（お試し利用）"
                      : currentPlan === "lite"
                        ? "ライト"
                        : currentPlan === "standard"
                          ? "スタンダード"
                          : "プロ"}
                </p>
                {!planLoading && subscriptionStatus && subscriptionStatus !== "active" && (
                  <p className="mt-1 text-xs text-amber-800">
                    契約状態:{" "}
                    {subscriptionStatus === "cancelled"
                      ? "解約済み"
                      : subscriptionStatus === "pending_deletion"
                        ? "削除予定"
                        : subscriptionStatus}
                    （有料機能は制限される場合があります）
                  </p>
                )}
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
              title={getLabPlanMarketing("free").name}
              priceLabel={getLabPlanMarketing("free").billingPriceLabel}
              description={getLabPlanMarketing("free").description}
              border="border-emerald-200"
              currentPlan={displayPlanForCards}
              planLoading={planLoading}
              onSelect={handleSelectPlan}
              badge={null}
              icon={<Sparkles className="h-5 w-5 text-emerald-600" />}
              features={[...getLabPlanMarketing("free").features]}
            />

            <PlanCard
              planId="lite"
              title={getLabPlanMarketing("lite").name}
              priceLabel={getLabPlanMarketing("lite").billingPriceLabel}
              annualPriceHint={getLabPlanMarketing("lite").annualBillingLabel}
              description={getLabPlanMarketing("lite").description}
              border="border-slate-200"
              currentPlan={displayPlanForCards}
              planLoading={planLoading}
              onSelect={handleSelectPlan}
              checkoutPending={checkoutPending}
              onCheckout={startStripeCheckout}
              badge={null}
              icon={<Sparkles className="h-5 w-5 text-slate-600" />}
              features={[...getLabPlanMarketing("lite").features]}
            />

            <PlanCard
              planId="standard"
              title={getLabPlanMarketing("standard").name}
              priceLabel={getLabPlanMarketing("standard").billingPriceLabel}
              annualPriceHint={getLabPlanMarketing("standard").annualBillingLabel}
              description={getLabPlanMarketing("standard").description}
              border="border-primary/20"
              currentPlan={displayPlanForCards}
              planLoading={planLoading}
              onSelect={handleSelectPlan}
              checkoutPending={checkoutPending}
              onCheckout={startStripeCheckout}
              badge={getLabPlanMarketing("standard").popular ? "人気" : null}
              icon={<Crown className="h-5 w-5 text-primary-foreground" />}
              features={[...getLabPlanMarketing("standard").features]}
            />

            <PlanCard
              planId="professional"
              title={getLabPlanMarketing("professional").name}
              priceLabel={getLabPlanMarketing("professional").billingPriceLabel}
              annualPriceHint={getLabPlanMarketing("professional").annualBillingLabel}
              description={getLabPlanMarketing("professional").description}
              border="border-amber-200"
              currentPlan={displayPlanForCards}
              planLoading={planLoading}
              onSelect={handleSelectPlan}
              checkoutPending={checkoutPending}
              onCheckout={startStripeCheckout}
              badge={null}
              icon={<Crown className="h-5 w-5 text-amber-600" />}
              features={[...getLabPlanMarketing("professional").features]}
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
  annualPriceHint,
  description,
  border,
  currentPlan,
  planLoading,
  onSelect,
  onCheckout,
  checkoutPending,
  badge,
  icon,
  features,
}: {
  planId: "free" | "lite" | "standard" | "professional"
  title: string
  priceLabel: string
  annualPriceHint?: string
  description: string
  border: string
  currentPlan: Plan | null
  planLoading: boolean
  onSelect: (plan: Plan) => void
  onCheckout?: (plan: Exclude<Plan, "free">, interval: BillingInterval) => void
  checkoutPending?: CheckoutPending | null
  badge: string | null
  icon: ReactNode
  features: string[]
}) {
  const isCurrent = currentPlan !== null && currentPlan === planId
  const isPaid = planId !== "free"

  function checkoutBusy(interval: BillingInterval) {
    return (
      checkoutPending?.plan === planId &&
      checkoutPending.interval === interval
    )
  }

  const anyCheckoutBusy = isPaid && checkoutPending?.plan === planId

  function handlePrimaryClick() {
    if (planLoading || isCurrent || anyCheckoutBusy) return
    if (isPaid) return
    onSelect(planId)
  }

  const freeButtonLabel = planLoading
    ? "取得中…"
    : isCurrent
      ? "現在のプラン"
      : "このプランにする"

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

      <div className="mb-3">
        <div className="text-xl font-extrabold text-gray-900">{priceLabel}</div>
        {annualPriceHint ? (
          <p className="mt-1.5 text-[11px] font-medium text-gray-600 leading-relaxed">
            {annualPriceHint}
          </p>
        ) : null}
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

      {isPaid && onCheckout ? (
        <div className="grid gap-2">
          <button
            type="button"
            onClick={() => onCheckout(planId, "month")}
            disabled={planLoading || isCurrent || checkoutBusy("month") || checkoutBusy("year")}
            className={[
              "w-full rounded-lg py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-2",
              planLoading || isCurrent || checkoutBusy("month") || checkoutBusy("year")
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white",
            ].join(" ")}
          >
            <CreditCard className="h-3.5 w-3.5" />
            {checkoutBusy("month") ? "処理中…" : "月払いで申し込む（Stripe）"}
          </button>
          <button
            type="button"
            onClick={() => onCheckout(planId, "year")}
            disabled={planLoading || isCurrent || checkoutBusy("month") || checkoutBusy("year")}
            className={[
              "w-full rounded-lg border-2 border-blue-600 py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-2",
              planLoading || isCurrent || checkoutBusy("month") || checkoutBusy("year")
                ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                : "bg-white text-blue-700 hover:bg-blue-50",
            ].join(" ")}
          >
            <CreditCard className="h-3.5 w-3.5" />
            {checkoutBusy("year") ? "処理中…" : "年払いで申し込む（2か月分お得）"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handlePrimaryClick}
          disabled={planLoading || isCurrent || anyCheckoutBusy}
          className={[
            "w-full rounded-lg py-2 text-xs font-semibold transition-colors flex items-center justify-center gap-2",
            planLoading || isCurrent || anyCheckoutBusy
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : `bg-blue-600 hover:bg-blue-700 text-white`,
            isCurrent && !anyCheckoutBusy && !planLoading ? "disabled:opacity-100" : "",
          ].join(" ")}
        >
          <CreditCard className="h-3.5 w-3.5" />
          {freeButtonLabel}
        </button>
      )}
    </div>
  )
}
