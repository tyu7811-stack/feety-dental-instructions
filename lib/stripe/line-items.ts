import type Stripe from "stripe"
import {
  type BillablePlanId,
  INITIAL_FEE_TAX_INCLUDED_JPY,
  PLAN_CATALOG,
} from "@/lib/stripe/catalog"
import { STRIPE_ENV } from "@/lib/stripe/stripe-env-names"

/**
 * 月額サブスクの1行。Price ID 優先。
 * 月額 Price ID: `STRIPE_ENV`（`lib/stripe/stripe-env-names.ts`）の変数名を参照。
 */
function recurringLineItem(
  planId: BillablePlanId
): Stripe.Checkout.SessionCreateParams.LineItem {
  const priceId =
    planId === "lite"
      ? process.env[STRIPE_ENV.priceLiteMonthly]?.trim() ||
        process.env[STRIPE_ENV.priceLiteLegacy]?.trim()
      : planId === "standard"
        ? process.env[STRIPE_ENV.priceStandardMonthly]?.trim() ||
          process.env[STRIPE_ENV.priceStandardLegacy]?.trim()
        : process.env[STRIPE_ENV.priceProfessionalMonthly]?.trim() ||
          process.env[STRIPE_ENV.priceProfessionalLegacy]?.trim()

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
  const priceId = process.env[STRIPE_ENV.priceInitialFee]?.trim()
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
