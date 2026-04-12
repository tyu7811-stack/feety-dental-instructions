import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { isBillablePlanId } from "@/lib/stripe/catalog"
import { checkoutLineItemsForPaidPlan } from "@/lib/stripe/line-items"
import { getStripe } from "@/lib/stripe/server"

export const runtime = "nodejs"

const bodySchema = z.object({
  planId: z.string(),
})

function appOrigin(request: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")
  if (env) return env
  const host = request.headers.get("host")
  const proto = request.headers.get("x-forwarded-proto") ?? "http"
  if (host) return `${proto}://${host}`
  return "http://localhost:3000"
}

export async function POST(request: NextRequest) {
  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success || !isBillablePlanId(parsed.data.planId)) {
    return NextResponse.json({ error: "Invalid planId" }, { status: 400 })
  }

  const planId = parsed.data.planId

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
  }

  const { data: subRow } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .eq("user_type", "lab")
    .maybeSingle()

  const rowPlan = subRow?.plan != null ? String(subRow.plan) : "free"
  const rowStatus = subRow?.status != null ? String(subRow.status) : ""
  const alreadyOnActivePaidPlan =
    rowStatus === "active" && isBillablePlanId(rowPlan)
  const includeInitialFee = !alreadyOnActivePaidPlan

  try {
    const stripe = getStripe()
    const origin = appOrigin(request)

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: checkoutLineItemsForPaidPlan(planId, { includeInitialFee }),
      success_url: `${origin}/lab/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/lab/billing?canceled=1`,
      client_reference_id: user.id,
      metadata: {
        supabase_user_id: user.id,
        plan_id: planId,
        include_initial_fee: includeInitialFee ? "true" : "false",
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          plan_id: planId,
        },
      },
      customer_email: user.email ?? undefined,
    })

    if (!session.url) {
      return NextResponse.json(
        { error: "Checkout URL を取得できませんでした" },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout の作成に失敗しました"
    if (message.includes("STRIPE_SECRET_KEY")) {
      return NextResponse.json(
        { error: "決済が未設定です（STRIPE_SECRET_KEY）" },
        { status: 503 }
      )
    }
    console.error("[stripe] checkout create failed:", e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
