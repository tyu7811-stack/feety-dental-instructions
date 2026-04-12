export const BILLABLE_PLAN_IDS = ["lite", "standard", "professional"] as const

export type BillablePlanId = (typeof BILLABLE_PLAN_IDS)[number]

export const BILLING_INTERVALS = ["month", "year"] as const

export type BillingInterval = (typeof BILLING_INTERVALS)[number]

export interface PlanCatalogEntry {
  name: string
  /** 税込・月払い（円／月） */
  monthlyAmountTaxIncludedJpy: number
  /**
   * 税込・年払い（円／年）
   * 月額×10＝12か月分のうち2か月分相当お得（税込のまま割引表現）
   */
  annualAmountTaxIncludedJpy: number
}

/** サーバー側の単一の価格ソース（表示は lab-plans 等から参照） */
export const PLAN_CATALOG: Record<BillablePlanId, PlanCatalogEntry> = {
  lite: {
    name: "FEETY ライト",
    monthlyAmountTaxIncludedJpy: 5_200,
    annualAmountTaxIncludedJpy: 52_000,
  },
  standard: {
    name: "FEETY スタンダード",
    monthlyAmountTaxIncludedJpy: 6_200,
    annualAmountTaxIncludedJpy: 62_000,
  },
  professional: {
    name: "FEETY プロ",
    monthlyAmountTaxIncludedJpy: 8_980,
    annualAmountTaxIncludedJpy: 89_800,
  },
}

export function isBillablePlanId(v: string): v is BillablePlanId {
  return (BILLABLE_PLAN_IDS as readonly string[]).includes(v)
}

export function isBillingInterval(v: string): v is BillingInterval {
  return (BILLING_INTERVALS as readonly string[]).includes(v)
}

export function formatYenTaxIncluded(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`
}

export function catalogUnitAmount(
  planId: BillablePlanId,
  interval: BillingInterval
): number {
  const c = PLAN_CATALOG[planId]
  return interval === "year" ? c.annualAmountTaxIncludedJpy : c.monthlyAmountTaxIncludedJpy
}
