import type Stripe from "stripe"
import type { PostgrestError } from "@supabase/supabase-js"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { isBillablePlanId } from "@/lib/stripe/catalog"

function mapStripeStatus(
  status: Stripe.Subscription.Status
): "active" | "cancelled" {
  if (status === "active" || status === "trialing") return "active"
  return "cancelled"
}

function logUpsertError(
  source: string,
  error: PostgrestError,
  context: Record<string, unknown>
): void {
  console.error("[stripe] subscriptions upsert failed", {
    source,
    message: error.message,
    code: error.code,
    details: error.details,
    ...context,
  })
}

export async function syncLabPlanFromCheckoutSession(
  session: Stripe.Checkout.Session
): Promise<void> {
  if (session.mode !== "subscription") return

  const userId = session.metadata?.supabase_user_id?.trim()
  const planId = session.metadata?.plan_id?.trim()
  if (!userId) {
    console.warn("[stripe] checkout.session: skip (no supabase_user_id)", {
      sessionId: session.id,
    })
    return
  }
  if (!planId) {
    console.warn("[stripe] checkout.session: skip (no plan_id)", {
      sessionId: session.id,
      userId,
    })
    return
  }
  if (!isBillablePlanId(planId)) {
    console.warn("[stripe] checkout.session: skip (invalid plan_id)", {
      sessionId: session.id,
      userId,
      plan_id: planId,
    })
    return
  }

  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    console.warn("[stripe] SUPABASE_SERVICE_ROLE_KEY unset; skip subscriptions sync")
    return
  }

  // user_id 重複時は UPDATE。plan は DB 列名（Stripe metadata の plan_id と対応）
  const { error } = await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      user_type: "lab",
      status: "active",
      plan: planId,
    },
    { onConflict: "user_id" }
  )

  if (error) {
    logUpsertError("checkout.session.completed", error, {
      sessionId: session.id,
      userId,
      plan_id: planId,
    })
  }
}

export async function syncLabPlanFromStripeSubscription(
  sub: Stripe.Subscription
): Promise<void> {
  const userId = sub.metadata?.supabase_user_id?.trim()
  const planIdFromMeta = sub.metadata?.plan_id?.trim()
  if (!userId) {
    console.warn("[stripe] subscription: skip (no supabase_user_id)", {
      subscriptionId: sub.id,
    })
    return
  }

  const supabaseAdmin = getSupabaseAdmin()
  if (!supabaseAdmin) {
    console.warn("[stripe] SUPABASE_SERVICE_ROLE_KEY unset; skip subscriptions sync")
    return
  }

  const status = mapStripeStatus(sub.status)
  const planId =
    planIdFromMeta && isBillablePlanId(planIdFromMeta)
      ? planIdFromMeta
      : undefined

  const { error } = await supabaseAdmin.from("subscriptions").upsert(
    {
      user_id: userId,
      user_type: "lab",
      status,
      ...(planId ? { plan: planId } : {}),
    },
    { onConflict: "user_id" }
  )

  if (error) {
    logUpsertError("customer.subscription", error, {
      subscriptionId: sub.id,
      userId,
      stripeStatus: sub.status,
      plan_id: planId ?? null,
    })
  }
}
