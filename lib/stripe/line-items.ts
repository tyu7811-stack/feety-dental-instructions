import type Stripe from "stripe"
import {
  type BillablePlanId,
  PLAN_CATALOG,
} from "@/lib/stripe/catalog"

/**
 * ダッシュボードの Price ID があればそれを使用。なければサーバーカタログで price_data を生成。
 */
export function checkoutLineItemForPlan(
  planId: BillablePlanId
): Stripe.Checkout.SessionCreateParams.LineItem {
  const envKey = `STRIPE_PRICE_${planId.toUpperCase()}` as const
  const priceId = process.env[envKey]?.trim()
  if (priceId) {
    return { price: priceId, quantity: 1 }
  }
  const c = PLAN_CATALOG[planId]
  return {
    quantity: 1,
    price_data: {
      currency: "jpy",
      product_data: { name: c.name },
      unit_amount: c.amountJpy,
      recurring: { interval: "month" },
    },
  }
}
