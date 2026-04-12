/**
 * 技工所向け料金プラン（マーケ・プラン画面・課金UIの単一ソース）
 * Stripe の plan id: lite | standard | professional（表示名は「プロ」）
 * 金額の数値は lib/stripe/catalog.ts と一致させること。
 */
import {
  PLAN_CATALOG,
  formatYenTaxIncluded,
} from "@/lib/stripe/catalog"

export const labPlanIds = ["free", "lite", "standard", "professional"] as const
export type LabPlanMarketingId = (typeof labPlanIds)[number]

export interface LabPlanMarketingRow {
  id: LabPlanMarketingId
  name: string
  description: string
  priceDisplay: string
  priceNote: string
  /** プラン・お支払い画面の金額1行（月払い） */
  billingPriceLabel: string
  /** 年払い1行（有料プランのみ） */
  annualBillingLabel?: string
  /** カード・比較表に並べる機能行 */
  features: readonly string[]
  popular: boolean
}

export const labPlansMarketing: readonly LabPlanMarketingRow[] = [
  {
    id: "free",
    name: "フリー",
    description: "お試し利用",
    priceDisplay: "¥0",
    priceNote: "/ 月額",
    billingPriceLabel: "¥0 / 月額",
    features: [
      "案件管理（5件／月まで）",
      "技工指示書の受信",
      "納品書作成",
      "提携医院（3件まで）",
    ],
    popular: false,
  },
  {
    id: "lite",
    name: "ライト",
    description: "小規模技工所向け",
    priceDisplay: formatYenTaxIncluded(PLAN_CATALOG.lite.monthlyAmountTaxIncludedJpy),
    priceNote: "/ 月（税込）",
    billingPriceLabel: `${formatYenTaxIncluded(PLAN_CATALOG.lite.monthlyAmountTaxIncludedJpy)} / 月（税込）`,
    annualBillingLabel: `${formatYenTaxIncluded(PLAN_CATALOG.lite.annualAmountTaxIncludedJpy)} / 年（税込・月額の10回分／2か月分お得）`,
    features: [
      "案件管理（30件／月まで）",
      "技工指示書の受信",
      "納品書作成",
      "提携医院（10件まで）",
      "メールサポート",
    ],
    popular: false,
  },
  {
    id: "standard",
    name: "スタンダード",
    description: "中規模技工所向け",
    priceDisplay: formatYenTaxIncluded(PLAN_CATALOG.standard.monthlyAmountTaxIncludedJpy),
    priceNote: "/ 月（税込）",
    billingPriceLabel: `${formatYenTaxIncluded(PLAN_CATALOG.standard.monthlyAmountTaxIncludedJpy)} / 月（税込）`,
    annualBillingLabel: `${formatYenTaxIncluded(PLAN_CATALOG.standard.annualAmountTaxIncludedJpy)} / 年（税込・月額の10回分／2か月分お得）`,
    features: [
      "案件管理（100件／月まで）",
      "技工指示書の受信",
      "納品書作成",
      "提携医院（30件まで）",
      "売上分析レポート",
      "優先サポート",
    ],
    popular: true,
  },
  {
    id: "professional",
    name: "プロ",
    description: "大規模技工所向け",
    priceDisplay: formatYenTaxIncluded(PLAN_CATALOG.professional.monthlyAmountTaxIncludedJpy),
    priceNote: "/ 月（税込）",
    billingPriceLabel: `${formatYenTaxIncluded(PLAN_CATALOG.professional.monthlyAmountTaxIncludedJpy)} / 月（税込）`,
    annualBillingLabel: `${formatYenTaxIncluded(PLAN_CATALOG.professional.annualAmountTaxIncludedJpy)} / 年（税込・月額の10回分／2か月分お得）`,
    features: [
      "案件管理（無制限）",
      "技工指示書の受信",
      "納品書作成",
      "提携医院（無制限）",
      "高度な分析機能",
      "専任サポート",
      "カスタム機能相談",
    ],
    popular: false,
  },
] as const

export function getLabPlanMarketing(id: LabPlanMarketingId): LabPlanMarketingRow {
  const row = labPlansMarketing.find((p) => p.id === id)
  if (!row) throw new Error(`Unknown lab plan: ${id}`)
  return row
}
