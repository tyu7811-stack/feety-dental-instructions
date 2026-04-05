import type { User } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

export type ResolvedClinic = {
  id: string
  lab_id: string | null
}

function normalizeEmail(e: string | undefined | null) {
  return (e ?? "").trim().toLowerCase()
}

/**
 * ログイン中医院ユーザーの clinics 行を解決する。
 * 技工所が事前登録した行（user_id が空・メール一致）なら user_id を紐づけてクレームする。
 */
export async function resolveClinicForUser(
  supabase: SupabaseClient,
  user: User
): Promise<{ data: ResolvedClinic | null; error?: string }> {
  const uid = user.id

  const { data: own, error: ownErr } = await supabase
    .from("clinics")
    .select("id, lab_id")
    .eq("user_id", uid)
    .maybeSingle()

  if (ownErr) {
    return { data: null, error: ownErr.message }
  }
  if (own) {
    return { data: own }
  }

  const email = normalizeEmail(user.email)
  if (!email) {
    return { data: null }
  }

  const { data: pendingList, error: pendingErr } = await supabase
    .from("clinics")
    .select("id, lab_id, email")
    .is("user_id", null)

  if (pendingErr) {
    return { data: null, error: pendingErr.message }
  }

  const match = pendingList?.find(
    (row) => row.email && normalizeEmail(row.email) === email
  )
  if (!match) {
    return { data: null }
  }

  const { data: claimed, error: claimErr } = await supabase
    .from("clinics")
    .update({ user_id: uid })
    .eq("id", match.id)
    .is("user_id", null)
    .select("id, lab_id")
    .single()

  if (claimErr) {
    return { data: null, error: claimErr.message }
  }

  return { data: claimed }
}
