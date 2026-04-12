import type { SupabaseClient } from "@supabase/supabase-js"
import type { LabPlanMarketingId } from "@/lib/content/lab-plans"

export type LabSubscriptionSnapshot = {
  plan: LabPlanMarketingId
  status: string
  canGenerateInvoice: boolean
}

/** DB / Stripe metadata の生文字列をマーケ用プラン ID に正規化 */
export function normalizeLabPlanId(raw: string | null | undefined): LabPlanMarketingId {
  const v = (raw ?? "free").toLowerCase().trim()
  if (v === "lite") return "lite"
  if (v === "standard") return "standard"
  if (v === "premium") return "standard"
  if (v === "professional" || v === "pro") return "professional"
  return "free"
}

/** 有料機能（請求書 PDF 等）を許可する契約状態 */
export function subscriptionStatusAllowsPaidFeatures(status: string | null | undefined): boolean {
  const s = (status ?? "").trim().toLowerCase()
  return s === "active"
}

export function computeCanGenerateInvoice(
  plan: LabPlanMarketingId,
  status: string
): boolean {
  if (!subscriptionStatusAllowsPaidFeatures(status)) return false
  return plan === "lite" || plan === "standard" || plan === "professional"
}

export async function fetchLabSubscriptionSnapshot(
  supabase: SupabaseClient,
  userId: string
): Promise<LabSubscriptionSnapshot> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", userId)
    .eq("user_type", "lab")
    .maybeSingle()

  if (error) {
    console.warn("[lab-subscription] select failed:", error.message)
  }

  if (!data) {
    const plan: LabPlanMarketingId = "free"
    return {
      plan,
      status: "active",
      canGenerateInvoice: computeCanGenerateInvoice(plan, "active"),
    }
  }

  const row = data as { plan: string | null; status: string | null }
  const plan = normalizeLabPlanId(row.plan)
  const status = (row.status ?? "active").trim() || "active"
  return {
    plan,
    status,
    canGenerateInvoice: computeCanGenerateInvoice(plan, status),
  }
}
