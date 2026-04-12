import type Stripe from "stripe"
import {
  type BillablePlanId,
  INITIAL_FEE_TAX_INCLUDED_JPY,
  PLAN_CATALOG,
} from "@/lib/stripe/catalog"

/**
 * 月額サブスクの1行。Price ID 優先。
 * STRIPE_PRICE_LITE_MONTHLY または後方互換 STRIPE_PRICE_LITE
 */
function recurringLineItem(
  planId: BillablePlanId
): Stripe.Checkout.SessionCreateParams.LineItem {
  const u = planId.toUpperCase()
  const monthlyKey = `STRIPE_PRICE_${u}_MONTHLY` as const
  const legacyKey = `STRIPE_PRICE_${u}` as const
  const priceId =
    process.env[monthlyKey]?.trim() || process.env[legacyKey]?.trim()

  if (priceId) {
    return { price: priceId, quantity: 1 }
  }

  const c = PLAN_CATALOG[planId]
  return {
    quantity: 1,
    price_data: {
      currency: "jpy",
      product_data: { name: `${c.name}（月額・税込）` },
      unit_amount: c.monthlyAmountTaxIncludedJpy,
      recurring: { interval: "month" },
    },
  }
}

/** 初回のみ（税込）。Price ID 優先。 */
function initialFeeLineItem(): Stripe.Checkout.SessionCreateParams.LineItem {
  const priceId = process.env.STRIPE_PRICE_INITIAL_FEE?.trim()
  if (priceId) {
    return { price: priceId, quantity: 1 }
  }
  return {
    quantity: 1,
    price_data: {
      currency: "jpy",
      product_data: { name: "初回契約手数料（税込・全プラン共通）" },
      unit_amount: INITIAL_FEE_TAX_INCLUDED_JPY,
    },
  }
}

/**
 * 有料プランの Checkout 用 line_items。
 * `includeInitialFee`: 初回契約手数料を同時請求するか（既に有料プラン契約中のアップグレード等では false）。
 */
export function checkoutLineItemsForPaidPlan(
  planId: BillablePlanId,
  options: { includeInitialFee: boolean }
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    recurringLineItem(planId),
  ]
  if (options.includeInitialFee) {
    items.push(initialFeeLineItem())
  }
  return items
}
