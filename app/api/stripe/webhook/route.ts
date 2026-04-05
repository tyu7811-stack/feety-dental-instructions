import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import {
  syncLabPlanFromCheckoutSession,
  syncLabPlanFromStripeSubscription,
} from "@/lib/stripe/sync-lab-subscription"
import { getStripe } from "@/lib/stripe/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error("[stripe] STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json({ error: "Webhook 未設定" }, { status: 500 })
  }

  // 署名検証には未加工のボディが必須（json() 等で読むと失敗する）
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")
  if (!sig) {
    return NextResponse.json({ error: "署名がありません" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (e) {
    console.error("[stripe] webhook signature failed:", e)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        console.log("[stripe] checkout.session.completed", {
          id: session.id,
          mode: session.mode,
          metadata: session.metadata,
        })
        await syncLabPlanFromCheckoutSession(session)
        break
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription
        console.log(`[stripe] ${event.type}`, {
          id: sub.id,
          status: sub.status,
          metadata: sub.metadata,
        })
        await syncLabPlanFromStripeSubscription(sub)
        break
      }
      default:
        break
    }
  } catch (e) {
    console.error("[stripe] webhook handler error:", e)
    return NextResponse.json({ error: "Handler error" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
