import type { SupabaseClient, User } from "@supabase/supabase-js"
import {
  fetchLabSubscriptionSnapshot,
  labPostAuthPath,
} from "@/lib/subscription/lab-subscription"

async function resolveRole(
  supabase: SupabaseClient,
  user: User
): Promise<"admin" | "clinic" | "lab" | null> {
  const fromMeta =
    (user.user_metadata?.role as string | undefined) ??
    (user.user_metadata?.user_type as string | undefined) ??
    (user.app_metadata?.role as string | undefined)
  if (fromMeta === "admin") return "admin"
  if (fromMeta === "clinic") return "clinic"
  if (fromMeta === "lab") return "lab"

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  const r = profile?.role as string | undefined
  if (r === "admin") return "admin"
  if (r === "clinic") return "clinic"
  if (r === "lab") return "lab"
  return null
}

/**
 * メールリンク（/auth/callback）やログイン直後と同じ基準で遷移先を決める。
 * 技工所で有料が未契約・無効なら `/lab/billing?from=auth`。
 */
export async function resolvePostAuthRedirectPath(
  supabase: SupabaseClient,
  user: User
): Promise<string> {
  const role = await resolveRole(supabase, user)
  if (role === "admin") return "/admin"
  if (role === "clinic") return "/clinic/dashboard"
  if (role !== "lab") return "/lab/dashboard"

  const snap = await fetchLabSubscriptionSnapshot(supabase, user.id)
  const p = labPostAuthPath(snap)
  if (p === "/lab/billing") return "/lab/billing?from=auth"
  return "/lab/dashboard"
}
