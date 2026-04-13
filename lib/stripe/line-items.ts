import type Stripe from "stripe"
import {
  type BillablePlanId,
  INITIAL_FEE_TAX_INCLUDED_JPY,
  PLAN_CATALOG,
} from "@/lib/stripe/catalog"

/**
 * 月額サブスクの1行。Checkout 表示崩れを避けるため、要点だけの文言をコード側で固定する。
 */
function recurringLineItem(
  planId: BillablePlanId
): Stripe.Checkout.SessionCreateParams.LineItem {
  const c = PLAN_CATALOG[planId]
  return {
    quantity: 1,
    price_data: {
      currency: "jpy",
      product_data: { name: `${c.name} 月額` },
      unit_amount: c.monthlyAmountTaxIncludedJpy,
      recurring: { interval: "month" },
    },
  }
}

/** 初回のみ（税込）。ライト・スタンダード・プロの初回費用は共通 50,000 円。 */
function initialFeeLineItem(
  planId: BillablePlanId
): Stripe.Checkout.SessionCreateParams.LineItem {
  const c = PLAN_CATALOG[planId]
  return {
    quantity: 1,
    price_data: {
      currency: "jpy",
      product_data: { name: `${c.name} 初回のみ` },
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
    items.push(initialFeeLineItem(planId))
  }
  return items
}
