import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { isBillablePlanId } from "@/lib/stripe/catalog"
import { getStripe } from "@/lib/stripe/server"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id")
  if (!sessionId) {
    return NextResponse.json({ error: "session_id が必要です" }, { status: 400 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.metadata?.supabase_user_id !== user.id) {
      return NextResponse.json({ error: "不正なセッションです" }, { status: 403 })
    }

    const planId = session.metadata?.plan_id
    if (!planId || !isBillablePlanId(planId)) {
      return NextResponse.json({ error: "プラン情報がありません" }, { status: 422 })
    }

    const ok =
      session.status === "complete" &&
      (session.payment_status === "paid" || session.payment_status === "no_payment_required")

    if (!ok) {
      return NextResponse.json(
        { error: "決済が完了していません", status: session.status },
        { status: 409 }
      )
    }

    return NextResponse.json({ planId })
  } catch (e) {
    console.error("[stripe] session retrieve failed:", e)
    return NextResponse.json({ error: "セッションの確認に失敗しました" }, { status: 500 })
  }
}
