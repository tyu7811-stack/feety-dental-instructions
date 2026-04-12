import type Stripe from "stripe"
import {
  type BillablePlanId,
  type BillingInterval,
  PLAN_CATALOG,
  catalogUnitAmount,
} from "@/lib/stripe/catalog"

/**
 * ダッシュボードの Price ID があれば使用。なければサーバーカタログで price_data を生成。
 *
 * 環境変数（本番推奨）:
 * - 月払い: STRIPE_PRICE_LITE_MONTHLY, STRIPE_PRICE_STANDARD_MONTHLY, STRIPE_PRICE_PROFESSIONAL_MONTHLY
 * - 年払い: STRIPE_PRICE_LITE_YEARLY, STRIPE_PRICE_STANDARD_YEARLY, STRIPE_PRICE_PROFESSIONAL_YEARLY
 *
 * 後方互換: 月払いのみ STRIPE_PRICE_LITE 等があれば月払いとして使用（年払いは _YEARLY が必要）
 */
export function checkoutLineItemForPlan(
  planId: BillablePlanId,
  interval: BillingInterval
): Stripe.Checkout.SessionCreateParams.LineItem {
  const u = planId.toUpperCase()
  const monthlyKey = `STRIPE_PRICE_${u}_MONTHLY` as const
  const yearlyKey = `STRIPE_PRICE_${u}_YEARLY` as const
  const legacyKey = `STRIPE_PRICE_${u}` as const

  const priceId =
    interval === "month"
      ? process.env[monthlyKey]?.trim() || process.env[legacyKey]?.trim()
      : process.env[yearlyKey]?.trim()

  if (priceId) {
    return { price: priceId, quantity: 1 }
  }

  const c = PLAN_CATALOG[planId]
  const stripeInterval = interval === "year" ? "year" : "month"
  const suffix = interval === "year" ? "（年払い・税込）" : "（月払い・税込）"

  return {
    quantity: 1,
    price_data: {
      currency: "jpy",
      product_data: { name: `${c.name}${suffix}` },
      unit_amount: catalogUnitAmount(planId, interval),
      recurring: { interval: stripeInterval },
    },
  }
}
