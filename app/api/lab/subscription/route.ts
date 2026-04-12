import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { fetchLabSubscriptionSnapshot } from "@/lib/subscription/lab-subscription"

export const dynamic = "force-dynamic"

/**
 * ログイン中の技工所ユーザーの subscriptions 行（なければフリー扱い）を返す。
 */
export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
  }

  const snapshot = await fetchLabSubscriptionSnapshot(supabase, user.id)
  return NextResponse.json(snapshot)
}
