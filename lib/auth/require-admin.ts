import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export type AdminSession =
  | { ok: true; userId: string }
  | { ok: false }

/** サーバーコンポーネント用: 非管理者は /lab/dashboard へ */
export async function requireAdminPage(): Promise<AdminSession> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, user_type")
    .eq("id", user.id)
    .maybeSingle()

  const pr = profile as { role?: string; user_type?: string } | null
  const isAdmin =
    pr?.role === "admin" || pr?.user_type === "admin"

  if (!isAdmin) {
    const raw = String(pr?.user_type ?? pr?.role ?? "")
    if (raw === "clinic") {
      redirect("/clinic/dashboard")
    }
    redirect("/lab/dashboard")
  }

  return { ok: true, userId: user.id }
}
