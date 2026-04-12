export const BILLABLE_PLAN_IDS = ["lite", "standard", "professional"] as const

export type BillablePlanId = (typeof BILLABLE_PLAN_IDS)[number]

export interface PlanCatalogEntry {
  name: string
  amountJpy: number
}

/** サーバー側の単一の価格ソース（フロントの表示と独立） */
export const PLAN_CATALOG: Record<BillablePlanId, PlanCatalogEntry> = {
  lite: { name: "FEETY ライト", amountJpy: 3_980 },
  standard: { name: "FEETY スタンダード", amountJpy: 9_800 },
  professional: { name: "FEETY プロ", amountJpy: 19_800 },
}

export function isBillablePlanId(v: string): v is BillablePlanId {
  return (BILLABLE_PLAN_IDS as readonly string[]).includes(v)
}
