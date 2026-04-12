export const BILLABLE_PLAN_IDS = ["lite", "standard", "professional"] as const

export type BillablePlanId = (typeof BILLABLE_PLAN_IDS)[number]

/** ライト・スタンダード・プロ共通の初回費用（税込・円） */
export const INITIAL_FEE_TAX_INCLUDED_JPY = 50_000

export interface PlanCatalogEntry {
  name: string
  /** 税込・月額利用料（円／月） */
  monthlyAmountTaxIncludedJpy: number
}

/** サーバー側の単一の価格ソース（表示は lab-plans 等から参照） */
export const PLAN_CATALOG: Record<BillablePlanId, PlanCatalogEntry> = {
  lite: {
    name: "FEETY ライト",
    monthlyAmountTaxIncludedJpy: 2_000,
  },
  standard: {
    name: "FEETY スタンダード",
    monthlyAmountTaxIncludedJpy: 12_000,
  },
  professional: {
    name: "FEETY プロ",
    monthlyAmountTaxIncludedJpy: 39_800,
  },
}

export function isBillablePlanId(v: string): v is BillablePlanId {
  return (BILLABLE_PLAN_IDS as readonly string[]).includes(v)
}

export function formatYenTaxIncluded(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`
}

export function initialFeeSummaryLine(): string {
  return `初回のみ ${formatYenTaxIncluded(INITIAL_FEE_TAX_INCLUDED_JPY)}（税込）＋月額`
}
